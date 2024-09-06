const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');
connectToMongo();
const app = express();
const port = 5000;
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(cors());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/course',require('./routes/course'));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
