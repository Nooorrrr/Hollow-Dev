import mongoose from "mongoose";


const characterSchema = new mongoose.Schema({
    unique_name: { type: String, required: true },
    class: { type: String, required: true },
    level: { type: Number, required: true },
    health: { type: Number, required: true },
    mana: { type: Number, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model("characters",characterSchema); //exports a mongoose model named characters with the same schema of characterSchema, to be used in controller