import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const CustomButton = ({ onClick, text }) => {
    const theme = useTheme();  // Use the theme hook to access the current theme

    return (
        <Button
            onClick={onClick}
            variant="contained"
            sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                borderRadius: '8px',
                padding: '5px 20px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                color: theme.palette.mode === 'dark' ? 'black' : 'white', // Set text color based on mode
                backgroundColor: theme.palette.mode === 'dark' 
                    ? 'white'  
                    : '#333333',   
                ':hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                        ? '#999999'  // Darker hover color for dark mode
                        : '#444444',   // Hover background color for light mode
                    color: 'white', // Always white text on hover
                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            <Typography variant="button" color="inherit">
                {text}
            </Typography>
        </Button>
    );
};

export const Tag = ({ value, type }) => {
    const getStyles = () => {
        let color;
        switch (type) {
            case 'status':
                switch (value) {
                    case 'Completed':
                        color = 'rgba(56, 142, 60, 0.7)'; // Green
                        break;
                    case 'Overdue':
                        color = 'rgba(244, 67, 54, 0.7)'; // Red
                        break;
                    case 'Scheduled':
                        color = 'rgba(255, 193, 7, 0.7)'; // Yellow
                        break;
                    default:
                        color = 'rgba(33, 150, 243, 0.7)'; // Blue
                }
                break;
            case 'level':
                switch (value) {
                    case 'Initial':
                        color = 'rgba(56, 142, 60, 0.7)'; // Green
                        break;
                    case 'Intermediate':
                        color = 'rgba(255, 193, 7, 0.7)'; // Yellow
                        break;
                    case 'Final':
                        color = 'rgba(244, 67, 54, 0.7)'; // Red
                        break;
                    default:
                        color = 'rgba(33, 150, 243, 0.7)'; // Blue (Fallback)
                }
                break;
            case 'type':
                switch (value) {
                    case 'Behavioural Round':
                        color = 'rgba(56, 142, 60, 0.7)'; // Green
                        break;
                    case 'Technical Round':
                        color = 'rgba(33, 150, 243, 0.7)'; // Blue
                        break;
                    case 'Resume Review':
                        color = 'rgba(255, 193, 7, 0.7)'; // Yellow
                        break;
                    default:
                        color = 'rgba(0, 0, 0, 0.7)'; // Default color
                }
                break;
            default:
                color = 'rgba(0, 0, 0, 0.7)'; // Default color for unknown types
        }
        return {
            backgroundColor: color,
            color: '#000',
            padding: '4px 8px',
            borderRadius: 5,
            fontSize: '12px',
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'inline-block',
            boxShadow: 5,
            '&:hover': {
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)',
            },
        };
    };

    return <Box sx={getStyles()}>{value}</Box>;
};
