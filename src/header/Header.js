import React, { useState } from 'react';
import {
    Box, AppBar, Typography, Button,
    Toolbar, IconButton, Container,
    Divider, MenuItem, Drawer
} from '@mui/material';
import { alpha, styled, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "./ColorModeIconDropdown";
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../utils/utils';
import ScheduleInterviewPopup from '../dashboard/ScheduleInterviewPopup';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    borderRadius: 20,
    backdropFilter: "blur(24px)",
    border: "1px solid",
    borderColor: theme.palette.divider,
    boxShadow: theme.shadows[1],
    padding: "8px 12px",
}));

export default function AppAppBar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const handleOpenPopup = () => setIsPopupOpen(true);
    const handleClosePopup = () => setIsPopupOpen(false);

    const toggleDrawer = newOpen => () => {
        setOpen(newOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        console.log("Logout Event - Token Cleared.");
        navigate('/login');
    };

    const navigateToInterviewRoom = () => {
        navigate('/interview-room');
    };

    const navigateToHome = () => {
        navigate('/dashboard');
    };

    const theme = useTheme();

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: "transparent",
                backgroundImage: "none",
                mt: "calc(var(--template-frame-height, 0px) + 28px)",
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar
                    variant="dense"
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                        backdropFilter: "blur(5px)",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 0,
                        padding: "8px 16px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    }}
                >

                    {/* Site Icon */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            onClick={navigateToHome}
                            sx={{
                                padding: 0,
                                minWidth: 0,
                                borderRadius: "50%",
                                '&:hover': {
                                    backgroundColor: "transparent",
                                },
                            }}
                        >
                            <img
                                src="/path/to/your/logo.png"
                                alt="Logo"
                                style={{
                                    height: "40px",
                                    objectFit: "contain",
                                }}
                            />
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 0
                        }}
                    >
                        <Box sx={{ display: { xs: "none", md: "flex", gap: 20 } }}>
                            <Button
                                variant="text"
                                color="inherit"  // Ensures that the button color is inherited correctly based on the theme
                                size="small"
                                onClick={navigateToHome}
                                sx={{
                                    fontWeight: 'bold',
                                    color: theme.palette.mode === "dark" ? "white" : "#333333",
                                    ':hover': {
                                        backgroundColor: theme.palette.mode === "dark" ? "#444444" : "#999999",
                                    },
                                }}
                            >
                                Home
                            </Button>
                            <Button
                                variant="text"
                                color="inherit"  // Ensures that the button color is inherited correctly based on the theme
                                size="small"
                                sx={{
                                    fontWeight: 'bold',
                                    color: theme.palette.mode === "dark" ? "white" : "#333333",
                                    ':hover': {
                                        backgroundColor: theme.palette.mode === "dark" ? "#444444" : "#999999",
                                    },
                                }}
                            >
                                Candidates
                            </Button>
                            <Button
                                variant="text"
                                color="inherit"  // Ensures that the button color is inherited correctly based on the theme
                                size="small"
                                onClick={navigateToInterviewRoom}
                                sx={{
                                    fontWeight: 'bold',
                                    color: theme.palette.mode === "dark" ? "white" : "#333333",
                                    ':hover': {
                                        backgroundColor: theme.palette.mode === "dark" ? "#444444" : "#999999",
                                    },
                                }}
                            >
                                Interview Room
                            </Button>
                            <Button
                                variant="text"
                                color="inherit"
                                size="small"
                                sx={{
                                    fontWeight: 'bold',
                                    color: theme.palette.mode === "dark" ? "white" : "#333333",
                                    ':hover': {
                                        backgroundColor: theme.palette.mode === "dark" ? "#444444" : "#999999",
                                    },
                                }}
                            >
                                Feedback
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
                        <CustomButton onClick={handleOpenPopup} text="Schedule Interview" />
                        {isPopupOpen && <ScheduleInterviewPopup onClose={handleClosePopup} />}
                        <CustomButton onClick={handleLogout} text="Logout" />
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
                                    top: "var(--template-frame-height, 0px)",
                                    backgroundColor: theme.palette.background.default, // Ensure drawer matches the theme
                                }
                            }}
                        >
                            <Box sx={{ p: 2 }}>
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
                                <MenuItem onClick={navigateToInterviewRoom}>Interview Room</MenuItem>
                                <MenuItem>Feedback</MenuItem>
                                <MenuItem>Calendar</MenuItem>
                                <Divider sx={{ my: 3 }} />
                                <MenuItem>
                                    <Button
                                        variant="text"
                                        onClick={handleLogout}
                                        fullWidth
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: 'white',
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: theme.palette.primary.main,
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
    );
}
