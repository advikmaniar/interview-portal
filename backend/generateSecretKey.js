const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a random 64-byte secret key
const secretKey = crypto.randomBytes(64).toString('hex');

// Path to your .env file
const envFilePath = path.join(__dirname, '.env');

// Check if .env file exists, if not, create one
if (!fs.existsSync(envFilePath)) {
  fs.writeFileSync(envFilePath, `SECRET_KEY=${secretKey}\n`);
  console.log(`.env file created and secret key saved.`);
} else {
  // If .env exists, append the secret key
  const envContent = fs.readFileSync(envFilePath, 'utf-8');
  if (!envContent.includes('SECRET_KEY')) {
    fs.appendFileSync(envFilePath, `SECRET_KEY=${secretKey}\n`);
    console.log('Secret key added to .env file.');
  } else {
    console.log('SECRET_KEY already exists in .env.');
  }
}
