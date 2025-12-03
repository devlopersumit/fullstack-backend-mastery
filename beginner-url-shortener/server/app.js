import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

//DB Connection
connectDB();

app.get('/', (req, res) => {
    res.send("Hello World!")
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running successfully on port ${port}`)
});