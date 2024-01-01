const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = "https://matchmakers.onrender.com/";
app.listen(PORT, () => {
  console.log(`Matckmakers Server is running on port ${PORT}`);
});
