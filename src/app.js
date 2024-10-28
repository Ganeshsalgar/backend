import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// this is the configuration for the app 

//this consfiguration for the core[cross origin resoure shering]

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true
}))

// security practices

//allow the json response from the frontend at maximum 16kb for security of the server

app.use(express.json({limit :'16kb'}));

//for getting response form the URL of frontend then its coded with the [%20 or +] for that response handdle

app.use(express.urlencoded({extended : true ,limit : "16kb"}))

// this is store the file that img ,pdf for server making the public folder for that 
// this files are read only the by server 

app.use(express.static("public"))



// this is for the handdles middleware check point for requset

app.use(cookieParser());


export { app };