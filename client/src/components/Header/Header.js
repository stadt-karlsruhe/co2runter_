import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Divider,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import LineAxisIcon from "@mui/icons-material/LineAxis";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import axios from 'axios';

const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [co2Token, setCo2Token] = useState(localStorage.getItem('CO2Token'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const checkTokenValidity = async () => {
    try {
      const response = await axios.get('/api/isUserAuth', {
        headers: {
          'co2token': `${co2Token}`,
        },
      });
      if (response.status === 200) {
        console.log('Token is valid');
        setIsLoggedIn(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Token is invalid or expired');
        setIsLoggedIn(false);
      } else {
        console.log('An error occurred during token validation');
      }
    }
  };

  useEffect(() => {
    if (co2Token) {
      checkTokenValidity();
    }
  }, [co2Token]);

  const handleClick = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleNewPrint = () => {
    navigate("/CO2Rechner");
  };

  const handleLogout = () => {
    localStorage.removeItem('CO2Token');
    localStorage.removeItem('groupCode');
    setCo2Token(null);
    handleClose();
    navigate("/");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    handleClose();
  };

  const handleGroupSettings = () => {
    navigate("/groupSettings");
    handleClose();
  };

  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleClick}
        >
          <img
            src={process.env.PUBLIC_URL + "/images/Logos/CO2RunterLogo.svg"}
            alt="Logo"
            width="30"
            height="30"
          />
        </IconButton>
        <Typography
          variant="h6"
          style={{ flexGrow: 1, cursor: "pointer" }}
          onClick={handleClick}
        >
          {location.pathname === "/Dashboard"
            ? "CO2runter: Dashboard"
            : "CO2runter: App"}
        </Typography>
        {isLoggedIn ? (
          <>
            <IconButton color="inherit" onClick={handleMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleGroupSettings}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Gruppen Informationen</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Log out</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleNewPrint}>
                <ListItemIcon>
                  <NoteAddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Neuen CO2-Fußabdruck berechnen</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleDashboard}>
                <ListItemIcon>
                  <LineAxisIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>CO2runter Dashboard</ListItemText>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <IconButton color="inherit" onClick={handleMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleDashboard}>
                <ListItemIcon>
                  <LineAxisIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>CO2runter Dashboard</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogin}>
                <ListItemIcon>
                  <LoginIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Log in</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default Header;
