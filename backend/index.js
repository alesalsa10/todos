const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();

app.use(cors());

//Conncet DB
connectDB();

//init middleware
app.use(express.json());

//Define Routes
app.get('/', (req, res) => {res.send('it is working!')})
app.use('/api/register', require('./routes/api/register'));
app.use('/api/login', require('./routes/api/auth'));
app.use('/api/todos', require('./routes/api/todos'));

app.get('/', (req, res) => {
  res.send('it is working!');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
