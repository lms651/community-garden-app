import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
    initiator: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    initiatorPlants: [{ type: mongoose.Schema.Types.ObjectId, ref: "plant" }], // plants offered by initiator
    recipientPlants: [{ type: mongoose.Schema.Types.ObjectId, ref: "plant" }], // plants offered by recipient
    status: { type: String, enum: ["pending", "accepted", "completed"], default: "pending" }
}, {
    timestamps: true
    });

    const Trade = mongoose.model("trade", tradeSchema);
    export default Trade;