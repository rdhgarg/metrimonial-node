const mysql = require('mysql');
const express = require('express');
const app = express();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: '68.178.146.195',
  user: 'gaurang',
  password: 'work@2024',
  database: 'gaurang',
  port: 3306,
});

// Define a route to get all courses
app.get('/api/product', (req, res) => {
  const sqlQuery = 'SELECT * FROM project';

  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ products: results });
  });
});


app.get('/api/user', (req, res) => {
  const sqlQuery = 'SELECT * FROM users';

  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ products: results });
  });
});
// Define a route for the root endpoint
app.get('/', (req, res) => {
  res.send('Hello, this is the root endpoint.');
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
