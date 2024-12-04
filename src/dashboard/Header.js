import * as React from "react"
import { alpha, styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import MenuItem from "@mui/material/MenuItem"
import Drawer from "@mui/material/Drawer"
import MenuIcon from "@mui/icons-material/Menu"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import ColorModeIconDropdown from "./ColorModeIconDropdown"
import { useNavigate } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: "blur(24px)",
    border: "1px solid",
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: "8px 12px"
}))



export default function AppAppBar() {
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate();

    const toggleDrawer = newOpen => () => {
        setOpen(newOpen)
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        console.log("Logout Event - Token Cleared.")
        navigate('/login');
    };

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: "transparent",
                backgroundImage: "none",
                mt: "calc(var(--template-frame-height, 0px) + 28px)"
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <Box
                        sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 0 }}
                    >
                        <Box sx={{ display: { xs: "none", md: "flex", gap: 50 } }}>
                            <Button variant="text" color="info" size="small">
                                Interview Room
                            </Button>
                            <Button variant="text" color="info" size="small">
                                Feedback
                            </Button>
                            <Button variant="text" color="info" size="small">
                                Calendar
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            gap: 1,
                            alignItems: "center"
                        }}
                    >
                        <Button
                            onClick={handleLogout}
                            variant="text"
                            color="white"
                            sx={{
                                textTransform: 'none',
                                fontSize: '14px',
                                borderRadius: '8px',
                                padding: '7px',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#2196f3',
                                ':hover': {
                                    backgroundColor: '#1976d2',
                                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            Logout
                        </Button>
                        <ColorModeIconDropdown />
                    </Box>
                    <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
                        <ColorModeIconDropdown size="medium" />
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                            PaperProps={{
                                sx: {
                                    top: "var(--template-frame-height, 0px)"
                                }
                            }}
                        >
                            <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>
                                <MenuItem>Interview Room</MenuItem>
                                <MenuItem>Feedback</MenuItem>
                                <MenuItem>Calendar</MenuItem>
                                <Divider sx={{ my: 3 }} />
                                <MenuItem>
                                    <Button
                                        variant="text"
                                        onClick={handleLogout}
                                        fullWidth
                                        sx={{
                                            backgroundColor: "#1976d2",
                                            color: 'white',
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: '#1976d2',
                                                color: 'white'
                                            },
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </MenuItem>
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    )
}