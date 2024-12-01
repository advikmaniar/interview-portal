import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data);
            } catch (error) {
                console.error(error);
                navigate('/login');
            }
        };
        fetchData();
    }, [navigate]);

    if (!userData) return <div>Loading...</div>;

    return (
        <div>
            <h2>Welcome, {userData?.name}</h2>
            <p>Role: {userData.role}</p>
            {userData.role === 'candidate' && (
                <div>
                    <h3>Your Scheduled Interviews</h3>
                    <ul>
                        {userData.scheduledInterviews.map((interview) => (
                            <li key={interview._id}>
                                {new Date(interview.dateTime).toLocaleString()} with {interview.interviewerName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {userData.role === 'interviewer' && (
                <div>
                    <h3>Upcoming Interviews</h3>
                    <ul>
                        {userData.scheduledInterviews.map((interview) => (
                            <li key={interview._id}>
                                {new Date(interview.dateTime).toLocaleString()} with {interview.candidateName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
