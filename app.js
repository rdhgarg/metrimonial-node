const express = require('express');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
  host: 'learnnprepdb.cuml7mxd9x3f.ap-south-1.rds.amazonaws.com',
  user: 'learnnprep',
  password: 'learnnprep2024',
  database: 'lmsdb',
  port: 3306,
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to live database:', error);
    return;
  }
  console.log('Connected to live database.');
});

// Define a route to get all courses
app.get('/api/courses', (req, res) => {
  const sqlQuery = 'SELECT * FROM courses';

  connection.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ courses: results });
  });
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
