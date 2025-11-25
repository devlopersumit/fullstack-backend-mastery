const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes');
const notesRouter = require('./routes/notesRoutes');

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//DB Connection
connectDB();

//Auth Routes
app.use('/', authRouter);

//Notes Router
app.use('/api/notes', notesRouter);

//Test Route
app.get('/', (req, res) => {
    res.send('Testing Route...')
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running successfully at port ${port}`)
});