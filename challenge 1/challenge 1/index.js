import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import route from "./routes/characterRoutes.js"

const app=express();

app.use(bodyParser.json());

dotenv.config(); // the var in .env, will be loaded into process.env to be used 

const PORT = process.env.PORT || 5000;//get the var from process.env
const MONGOURL = process.env.MONGO_URL ; 

//connect the database with the script using mongoose (schema-based framework for modeling your data)
mongoose 
    .connect(MONGOURL) 
    .then(() =>{ //after connecting show msg 
    console.log("Database connected successefully");
    app.listen(PORT,() =>{ // Starts the server on port +listen to the requests
    console.log(`server is running on port ${PORT}`);
});
})

.catch((err) =>{console.log("error");}); 

app.use("/api/Characters",route);//Defines middleware to handle requests starting with /api/user using the route middleware ; this becomes /api/Characters/route


//i used postman to test them
