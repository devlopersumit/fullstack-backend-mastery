const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//DB Connection
connectDB();

//Test Route
app.get('/', (req, res) => {
    res.send('Testing Route...')
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running successfully at port ${port}`)
});