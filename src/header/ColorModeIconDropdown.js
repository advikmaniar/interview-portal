import * as React from "react";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useThemeMode } from "./ThemeModeProvider"; 

function ColorModeIconDropdown(props) {
  const { mode, toggleTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMode = (targetMode) => () => {
    toggleTheme(); 
    handleClose();
  };

  const icon = mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />;

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "color-scheme-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        {...props}
      >
        {icon}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem selected={mode === "dark"} onClick={handleMode("dark")}>
          Dark Mode
        </MenuItem>
        <MenuItem selected={mode === "light"} onClick={handleMode("light")}>
          Light Mode
        </MenuItem>
      </Menu>
    </>
  );
}


export default ColorModeIconDropdown;
