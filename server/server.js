

import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';


const server = express() ;
dotenv.config();
server.use(express.json());

import userRouter from "./Routes/UserRoute.js";
const  DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database successfully... ");
}).catch((error) => {
    console.log("Error connecting to database: ", error.message);
})

server.use("/api/users/", userRouter)


export default server





