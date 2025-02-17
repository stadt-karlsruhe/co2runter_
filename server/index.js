const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require("./middleware/auth");
const groups_routes = require("./routes/groups_routes");
const user_routes = require("./routes/user_routes");
const {db} = require('./services/db');
const dashboard_routes = require("./routes/dashboard_routes");

const config = require('./config.js');


// read questions from json file 
const fs = require('fs');
const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));


// Enable cors security headers
app.use(cors())

// add an express method to parse the POST method
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Route that returns all questions
app.get('/questions', (req, res) => {
  res.send(questions)
})

//Route to register a new user
app.post('/register', async (req, res) => {
    // Get user input
    const { email, password, username } =  req.body;

    // Validate user input
    if (!(email && password && username)) {
      res.status(400).send("All input is required");
    }
    const email_low = email.toLowerCase();
    // check if user already exists
    const SelectQuery = " SELECT * FROM  Users WHERE email = ?";
    db.query(SelectQuery, [email_low], async (err, result) => {
      if (result.length > 0) {
        res.status(409).send("User Already Exist. Please Login");
      } else {
        // encrypt password
        encryptedpassword = await bcrypt.hash(password, 10);
        // create new user
        const InsertQuery = " INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";
        db.query(InsertQuery, [username, email_low, encryptedpassword], (err, result) => {
          if(err) {
            console.log(err)
            res.status(500).send('Something went wrong')
          } else {
            user = result;
            // create token
            const token = jwt.sign(
              { user_id: result.insertId, email_low },
              config.auth.token_key,
              {
                expiresIn: "2h",
              }
            );
            // save user token
            user.token = token;
            res.status(201).send({token})
          }
        })
      }
    })
})

//Route to login a user
app.post('/login', async (req, res) => {
  // Get user input
  const { email, password } =  req.body;

  // Validate user input
  if (!(email && password)) {
    res.status(400).send("All input is required");
  }
  const email_low = email.toLowerCase();
  // check if user exists
  const SelectQuery = " SELECT * FROM  Users WHERE email = ?";
  db.query(SelectQuery, [email_low], async (err, result) => {
    if (result.length === 0) {
      res.status(400).send("Invalid Credentials");
    } else {
      user = result;
      // compare password
      const validPassword = await bcrypt.compare(password, await result[0].password);
      if (validPassword) {
        // create token
        const token = jwt.sign(
          { user_id: result[0].user_ID, email_low },
          config.auth.token_key,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.token = token;
        res.status(200).send({token})
      } else {
        res.status(400).send("Invalid Credentials");
      }
    }
  })
})


// Route to get all districts
app.get('/districts', (req, res) => {
  const SelectQuery = " SELECT * FROM  Districts";
  db.query(SelectQuery, (err, result) => {
    if(err) {
      console.log(err)
      res.status(500).send('Something went wrong')
    } else {
      res.status(200).send(result)
    }
  })
})

// route save footprint to db 
app.post('/footprint', (req, res) => {
  try {
    let success = true;
    // Get user input
    const { groups, district, data } = req.body;
    // Validate user input 
    if (!(groups && data)) {
      console.log(groups);
      console.log(district);
      console.log(data);
      success = false;
      res.status(400).send("Groups or data missing");
      console.log("field missing");
    } else if (!((groups.length > 0) || (district && data.length === 4))) {
      console.log(groups.length);
      success = false;
      res.status(400).send("All input is required");
      console.log("data in field missing");
      console.log(groups.length);
      console.log(district);
      console.log(data.length);
    } else {
      console.log("data is ok");
      console.log(groups);
      console.log(district);
      console.log(data);
      const InsertQuery = "INSERT INTO CO2Prints (mobility, housing, consume, nutrition, date) VALUES (?, ?, ?, ?, ?)";
      db.query(InsertQuery, [data[0], data[1], data[2], data[3], new Date()], (err, result) => {
        if (err) {
          console.log(err);
          success = false;
          if (err.code === 'ER_DUP_ENTRY') {
            // Ignore duplicate entry error and proceed
          } else {
            res.status(500).send('Something went wrong');
          }
        } else {
          // get the id of the footprint
          const footprint_id = result.insertId;
          // if a district is selected, add the footprint to the table Prints_In_Districts with these columns: district_ID and print_ID
          if (district > 0) {
            console.log("Added to District: " + district);
            const InsertQuery = "INSERT INTO Prints_In_Districts (district_ID, print_ID) VALUES (?, ?)";
            db.query(InsertQuery, [district, footprint_id], (err, result) => {
              if (err) {
                console.log(err);
                success = false;
                if (err.code === 'ER_DUP_ENTRY') {
                  // Ignore duplicate entry error and proceed
                } else {
                  res.status(500).send('Something went wrong');
                }
              }
            });
          }
          // if there are groups selected, add the footprint to all groups in the table Prints_In_Carbon_Footprint_Groups with these columns: group_ID and print_ID
          if (groups.length > 0) {
            groups.forEach(group => {
              // get the id of the group
              db.query("SELECT group_ID FROM Carbon_Footprint_Groups WHERE groupcode = ?", [group], (err, result) => {
                console.log("Getting id for group");
                console.log("groupcode: " + group);
                console.log(result);
                if (err) {
                  console.log(err);
                  success = false;
                  if (err.code === 'ER_DUP_ENTRY') {
                    // Ignore duplicate entry error and proceed
                  } else {
                    res.status(500).send('Something went wrong');
                  }
                } else {
                  console.log("Added to Group: " + result[0].group_ID);
                  const InsertQuery = "INSERT INTO Prints_In_Carbon_Footprint_Groups (group_ID, print_ID) VALUES (?, ?)";
                  db.query(InsertQuery, [result[0].group_ID, footprint_id], (err, result) => {
                    if (err) {
                      console.log(err);
                      success = false;
                      if (err.code === 'ER_DUP_ENTRY') {
                        // Ignore duplicate entry error and proceed
                      } else {
                        res.status(500).send('Something went wrong');
                      }
                    }
                  });
                }
              });
            });
          }
        }
        if (success) {
          res.status(200).send('Footprint saved');
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
  
})

// route get total number of foodprints	
app.get('/foodprint/total', (req, res) => {
  const SelectQuery = " SELECT COUNT(*) AS total FROM  CO2Prints";
  db.query(SelectQuery, (err, result) => {
    if(err) {
      console.log(err)
      res.status(500).send('Something went wrong')
    } else {
      res.status(200).send(result)
    }
  })
})

// route get total number of foodprints in a district for all districts
app.get('/foodprint/districts', (req, res) => {
  const SelectQuery = " SELECT Districts.name, COUNT(Prints_In_Districts.print_ID) AS total FROM Districts LEFT JOIN Prints_In_Districts ON Districts.district_ID = Prints_In_Districts.district_ID GROUP BY Districts.district_ID";
  db.query(SelectQuery, (err, result) => {
    if(err) {
      console.log(err)
      res.status(500).send('Something went wrong')
    } else {
      res.status(200).send(result)
    }
  })
})

app.use('/groups', groups_routes);
app.use('/user', user_routes);
app.use('/dashboard', dashboard_routes);


app.get('/user', auth, (req, res) => {
  res.send(req.user)
})

// endpoint to check if token is valid
app.get('/isUserAuth', auth, (req, res) => {
  res.status(200).send(true);
})

app.listen('3001', () => { })