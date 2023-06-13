import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Button, TextField, Typography, Stack } from "@mui/material";
import GroupSuccesfull from "./GroupSuccesfull";
import axios from "axios";

const GroupLoggedIn = () => {
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateGroup = async () => {
    const token = localStorage.getItem("CO2Token");
    try {
      const response = await axios.post("/api/groups/create", {
        co2token: token,
        groupname: groupName,
      });
      if (response.status === 200) {
        console.log("Responsedata: "+ response)
        setGroupCode(response.groupcode);  
        console.log(groupCode)    
      } else {
        console.log("Was?: " + response.data)
        const data = response.data;
        setError(data.error);
      }
    } catch (err) {
      setError("A server error occurred.");
    }
  };

  useEffect(() => {
    console.log("do something")   
  }, [groupCode]);

  return (
    <>
      <Header />
      <Stack spacing={2}>
        {groupCode ? (
          <GroupSuccesfull groupCode={groupCode} groupName={groupName} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h4">Neue Gruppe erstellen</Typography>
            {console.log(groupCode)}
            <Typography>
              Geben Sie einen Gruppenname ein. Anschließend wird Ihnen von uns
              einmal der Gruppenbeitrittscode, sowie ein Link und QR-Code
              mitgeteilt.
            </Typography>
            <TextField
              label="Gruppenname"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={{ width: "70%" }}
            />
            <Button disabled={!groupName} onClick={handleCreateGroup} variant="contained">
              Gruppe erstellen
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </div>
        )}
        <Button onClick={() => navigate(-1)}>Zurück</Button>
      </Stack>
      <Footer />
    </>
  );
};

export default GroupLoggedIn;
