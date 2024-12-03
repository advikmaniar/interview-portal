import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import { Button } from '@mui/material'; 

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
              const token = localStorage.getItem('token');
              const response = await axios.get('http://localhost:5000/profile/dashboard', {
                headers: { Authorization: `Bearer ${token}` }, 
              });
              setUserData(response.data);
              console.log(response.data);
            } catch (error) {
              console.error(error);
              navigate('/login'); 
            }
          };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        console.log("Logout Event - Token Cleared.")
        navigate('/login');
    };

    if (!userData) return <div>Loading...</div>;

    return (
        <div>
            <h2>Welcome, {userData?.username}</h2>
            <p>Role: {userData?.role}</p>
            {userData.role === 'candidate' && (
                <div>
                    <h3>Your Scheduled Interviews</h3>
                    {/* <ul>
                        {userData.scheduledInterviews.map((interview) => (
                            <li key={interview._id}>
                                {new Date(interview.dateTime).toLocaleString()} with {interview.interviewerName}
                            </li>
                        ))}
                    </ul> */}
                </div>
            )}
            {userData.role === 'interviewer' && (
                <div>
                    <h3>Upcoming Interviews</h3>
                    {/* <ul>
                        {userData.scheduledInterviews.map((interview) => (
                            <li key={interview._id}>
                                {new Date(interview.dateTime).toLocaleString()} with {interview.candidateName}
                            </li>
                        ))}
                    </ul> */}
                </div>
            )}
            {/* Logout Button */}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ py: 1 }}
                onClick={handleLogout} 
              >
                Logout
              </Button>
        </div>
    );
};

export default Dashboard;
