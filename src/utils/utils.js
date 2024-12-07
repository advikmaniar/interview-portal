import React from 'react';
import { Button, Typography } from '@mui/material';

export const CustomButton = ({ onClick, text }) => (
    <Button
        onClick={onClick}
        variant="contained"
        color="primary"
        sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            borderRadius: '8px',
            padding: '10px 20px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#2196f3',
            ':hover': {
                backgroundColor: '#1976d2',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
            },
        }}
    >
        <Typography variant="button" color="inherit">
            {text}
        </Typography>
    </Button>
);