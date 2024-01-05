const mysql = require('mysql');
const express = require('express');
const app = express();
const randomstring = require('randomstring');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');  // Don't forget to require jsonwebtoken

//const pool = mysql.createPool({
//  connectionLimit: 10,
//  host: 'localhost',
//  user: 'root',
//  password: '',
//  database: 'matrimonial-laravel',
//  port: 3306,
//});


const pool = mysql.createPool({
  connectionLimit: 10,
  host: '68.178.146.195',
  user: 'gaurang',
  password: 'work@2024',
  database: 'gaurang',
  port: 3306,
});
app.use(bodyParser.json());
const users = {};

function sendSMS(mobile, otp) {
  // Implement your SMS sending logic here
  console.log(`Sending OTP ${otp} to ${mobile}`);
}

app.get('/api/v1/login', (req, res) => {
  try {
    const { country_code, mobile, device_key } = req.body;

    // Simulating validation logic
    if (!country_code || !mobile || isNaN(country_code) || isNaN(mobile)) {
      return res.status(400).json({ status: false, msg: 'Invalid input data.' });
    }

    const mob = `${country_code}${mobile}`;

    // Simulating user data retrieval based on mobile from MySQL
    pool.query('SELECT * FROM users WHERE mobile = ?', [mobile], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ status: false, msg: 'Internal server error.' });
      }

      const user = results[0];

      if (!user) {
        // User not found, create a new user
        const otp = randomstring.generate({ length: 4, charset: 'numeric' });
        pool.query('INSERT INTO users (mobile, country_code, mobile_withcountry, register_otp, role, device_key,registration_source,registration_for) VALUES (?, ?, ?, ?, ?, ?)',
          [mobile, country_code, mob, otp, 'customer', device_key, 'web','metrimonial'], (insertError) => {
            if (insertError) {
              console.error(insertError);
              return res.status(500).json({ status: false, msg: 'Internal server error.' });
            }

            return res.status(200).json({ status: true, mobile_no: mobile, country_code: country_code, msg: 'Otp Sent Successfully' });
          });
      } else {
        if (user.is_deleted === 1) {
          return res.status(200).json({ status: false, msg: 'Your account is deleted, please send your query to support' });
        }

        const otp = (mobile === '9772079144') ? '1234' : randomstring.generate({ length: 4, charset: 'numeric' });

        if (!user.verify_otp_status) {
          // Update OTP for existing user
          pool.query('UPDATE users SET register_otp = ?, role = ? WHERE mobile = ?', [otp, 'customer', mobile], (updateError) => {
            if (updateError) {
              console.error(updateError);
              return res.status(500).json({ status: false, msg: 'Internal server error.' });
            }

            sendSMS(mob, otp);
            return res.status(200).json({ status: true, mobile_no: mobile, country_code: country_code, msg: 'Please verify now' });
          });
        } else {
          sendSMS(mob, otp);

          if (!user.refer_code) {
            // Generate refer_code for the user
            pool.query('UPDATE users SET refer_code = ? WHERE mobile = ?', ['EARN' + randomstring.generate({ length: 4, charset: 'alphabetic' }), mobile], (updateReferCodeError) => {
              if (updateReferCodeError) {
                console.error(updateReferCodeError);
                return res.status(500).json({ status: false, msg: 'Internal server error.' });
              }

              return res.status(200).json({ status: true, mobile_no: mobile, msg: 'Otp Sent Successfully' });
            });
          } else {
            // Update OTP and device_key for existing user
            pool.query('UPDATE users SET register_otp = ?, device_key = ? WHERE mobile = ?', [otp, device_key, mobile], (updateOtpError) => {
              if (updateOtpError) {
                console.error(updateOtpError);
                return res.status(500).json({ status: false, msg: 'Internal server error.' });
              }

              return res.status(200).json({ status: true, mobile_no: mobile, msg: 'Otp Sent Successfully' });
            });
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, msg: 'Internal server error.' });
  }
});

app.post('/api/v1/verify-otp', (req, res) => {
  try {
    const { country_code, mobile, otp } = req.body;

    // Simulating validation logic
    if (!country_code || !mobile || !otp || isNaN(country_code) || isNaN(mobile) || isNaN(otp)) {
      return res.status(400).json({ status: false, msg: 'Invalid input data.' });
    }

    // Simulating user data retrieval based on OTP and mobile from MySQL
    pool.query('SELECT * FROM users WHERE mobile = ? AND register_otp = ?', [mobile, otp], (error, rows) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ status: false, msg: 'Internal server error.' });
      }

      if (rows.length > 0) {
        const user = rows[0];

        // Generate access token using jwt
        const tokenResult = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
        
        return res.status(200).json({
          status: true,
          access_token: tokenResult,
          token_type: 'bearer',
          user: user,
          msg: 'Login Successfully',
        });
      } else {
        return res.status(401).json({
          status: false,
          msg: 'Invalid Otp',
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      msg: 'Internal server error.',
    });
  }
});
function authenticateUser(req, res, next) {
  const authorizationHeader = req.headers['authorization'];
  console.log(authorizationHeader);
  if (!authorizationHeader) {
    return res.status(401).json({ status: false, msg: 'Unauthorized: Access token missing' });
  }

  const accessToken = authorizationHeader.split(' ')[1];

  try {
    // Verify the JWT and extract the user ID
    const decodedToken = jwt.verify(accessToken, 'your_secret_key');
    const userId = decodedToken.userId;
    
    if (!userId) {
      return res.status(401).json({ status: false, msg: 'Unauthorized: Invalid access token 167' });
    }
    
    pool.query('SELECT * FROM users WHERE id = ?', [userId], (error, rows) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ status: false, msg: 'Internal server error.' });
      }

      if (rows.length > 0) {
        req.user = rows[0];
        next();
      }
      });
   
  } catch (error) {
    return res.status(401).json({ status: false, msg: 'Unauthorized: Invalid access token 173' });
  }
}

// "my_profile" endpoint
app.post('/api/v1/get-profile', authenticateUser, (req, res) => {
  const userProfile = req.user; // User data attached by the authenticateUser middleware
  res.json({ status: true, data: userProfile, msg: 'User profile retrieved successfully' });
});
// Define a route for the root endpoint
app.get('/', (req, res) => {
  res.send('Hello, welcome to match maker');
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.post('/api/v1/user-detail', authenticateUser, (req, res) => {
  const userDetail = {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    bio: req.user.bio,
  };
  res.json({ status: true, data: userDetail, message: 'User Detail' });
});