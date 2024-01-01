const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Create a connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'gaurang',
  password: 'work@2024',
  database: 'gaurang',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.query('SELECT * FROM projects', (error, results) => {
  if (error) throw error;

  // Log the fetched data
  console.log('Projects:', results);

  // Close the connection pool when the application is terminated
  process.on('SIGINT', () => {
    pool.end();
    console.log('Connection pool closed.');
  });
});
