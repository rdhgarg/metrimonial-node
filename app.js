
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'learnnprepdb.cuml7mxd9x3f.ap-south-1.rds.amazonaws.com',
  user: 'learnnprep',
  password: 'learnnprep2024',
  database: 'lmsdb',
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
