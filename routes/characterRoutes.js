import express , {Router} from "express"

import {fetch,create, update,deleteCharacter} from "../controller/characterController.js"



const route = express.Router();

route.post("/create",create); //The create method returns a JSON representation of the character we intend to add. This JSON data is sent as the body of a POST request to the /create endpoint, where it represents the data we want to post (or add).

route.get("/getAllcharacters",fetch); //fetch returns a json of all characters

route.put("/update/:id",update);

route.delete("/delete/:id",deleteCharacter);


export default route;


