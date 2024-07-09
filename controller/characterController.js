import Character from "../model/characterModel.js";

// function that returns a json data character
export const create = async (req, res) => {
    try{
        const characterData = new Character(req.body); //gives the whole data in json format
        const{unique_name} =  characterData //you are pulling out the unique_name property from the characterData object and creating a variable called unique_name that holds its value.
        const characterExist = await Character.findOne ({unique_name}); //find a character witht the same name, if it does, then it exists
        if(characterExist){
            return res.status(400).json({message:"character already exsists"});
        }
        //else
        const savedCharacter = await characterData.save(); //save the character inside the const.
        res.status(200).json(savedCharacter); //response of the request is only the added character in a json format

    }catch(error){
        res.status(500).json({error:"Internal Server error"}) // internal server error.
    }
}

export const fetch = async(req, res) =>{ // can be imported somewhere else
    try {
    const characters = await Character.find(); //fetch all characters from database
    if(characters.length ===0 ){
        return res.status(404).json({ message:"character not found"});
    }
    //200 everything went good 
    res.status(200).json(characters); //http response is all the characters .

    }catch(error){ //500 Internal Server Error.
        res.status(500).json({error:"Internal Server error"}) //sends a json respond with the message error.
    }
}

export const update = async(req, res) => {
    try{
        const id = req.params.id; //get the id from the req data
        const characterExist = await Character.findOne({_id:id}) //find if the character with that id exists

        if(!characterExist){
            return res.status(404).json({message: "character not found "})
        }
        const updateCharacter = await Character.findByIdAndUpdate(id,req.body, { new: true}) //new: true ensures that the returned charachter is the upsdated one
        res.status(201).json(updateCharacter); //the response is the updatedcharachter

    }catch(error){
        res.status(500).json({error:"Internal Server error"}) //sends a json respond with the message error.
    }
}



export const deleteCharacter = async (req, res) => {
    try {
        const id = req.params.id;
        const characterExist = await Character.findOne({ _id: id }); // Fixed typo: characterExist
        if (!characterExist) { // Variable name should match above
            return res.status(404).json({ message: "character not found" });
        }
        await Character.findByIdAndDelete(id); // Ensure this is deleting from the correct model (Character)
        res.status(201).json({ message: "character deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server error" }); // sends a json response with the error message.
    }
};
