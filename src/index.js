import dotenv from 'dotenv';
import connectDB from './db/index.js';



dotenv.config({
    path: './env'
})

connectDB()






























// // require('dotenv').config({path : './.env'})
// import dotenv from 'dotenv';
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from "express";

// dotenv.config();

// const app = express();
// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI} / ${DB_NAME}`)
//         console.log("\n Mongo DB is connected successfully ")
//         app.on("error", (error) => {
//             console.log("App connection ERROR" , error);
//             throw error
//         })

//         app.listen(process.env.PORT , () => {
//             console.log(`App is listening on port  ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("ERROR" , error)
//         throw error
//     }
// })()

