const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token

console.log('Environment Variables:', {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? 'Loaded' : 'Missing',
});

// Validate the presence of environment variables
if (!accountSid || !authToken) {
    throw new Error('Twilio Account SID and Auth Token must be set in environment variables.');
}

// Initialize the Twilio client
const twilioClient = twilio(accountSid, authToken);

module.exports = twilioClient;

