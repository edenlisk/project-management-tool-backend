import mongoose, { Schema, Types, model, Document } from "mongoose";


export interface IChatModel extends Document {
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId
}


const chatSchema = new Schema<IChatModel>(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }, {
        timestamps: true
    }
)

export default model("Chat", chatSchema);