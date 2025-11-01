import mongoose from "mongoose";

const plantSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
}, {
    timestamps: true
})

const Plant = mongoose.model("plant", plantSchema);
export default Plant;