import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
