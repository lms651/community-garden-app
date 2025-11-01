import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true }, // ADD GOOGLE LOCATION LATER
    garden: [
        {
            plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'plant', required: true },
            forTrade: { type: Boolean, default: false }
        }
    ]
}, {
    timestamps: true
})

const User = mongoose.model("user", userSchema);
export default User;