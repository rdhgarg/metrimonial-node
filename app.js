const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Match Makers Hello, World!');
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
