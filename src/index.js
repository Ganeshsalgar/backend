import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';



dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.on("error" , (error) => {
        console.log("ERRR : ", error);
        throw error
    })

    app.listen(process.env.PORT || 8000 , () => {
        console.log(`⚙️   Server is running at Port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO Db connection failed !!! " , err);
})






























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

