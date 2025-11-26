import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    displayName: { type: String, required: true, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    address: { type: String }, // ADD GOOGLE LOCATION LATER
    image: { type: String, default: "" },
    garden: [
        {
            plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'plant', required: true },
            forTrade: { type: Boolean, default: false }
        }
    ],
    dateDeleted: { type: Date, default: null }
}, {
    timestamps: true
})

const User = mongoose.model("user", userSchema);
export default User;