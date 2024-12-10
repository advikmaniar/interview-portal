import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (firstName, lastName, email, password, username, DOB, role) => {
  try {
    const response = await axios.post(`${API_URL}/register`, 
      {
        firstName,
        lastName,
        email,
        password,
        username,
        DOB,
        role, 
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
