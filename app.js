
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '68.178.158.76',
  user: 'gaurang_new',
  password: 'work@2023',
  database: 'gaurang_new',
  port: 3306, // Default MySQL port
});


connection.connect((error) => {
  if (error) {
    console.error('Error connecting to live database:', error);
    return;
  }
  console.log('Connected to live database.');

  // Your database queries or other logic here

  connection.end();
});
