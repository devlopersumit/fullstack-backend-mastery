import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import urlRouter from "./routes/url.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// DB Connection
connectDB();

// Use urlRouter for all routes
app.use('/', urlRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running successfully on port ${port}`);
});