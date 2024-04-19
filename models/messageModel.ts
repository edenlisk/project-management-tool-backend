import mongoose, { Schema, Types, model } from "mongoose";



export interface IMessageModel {
    chatId: Types.ObjectId,
    message: Types.ObjectId | string,
    senderId: Types.ObjectId
}


const messageSchema = new Schema<IMessageModel>(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        },
        message: {
            type: String || mongoose.Schema.Types.Buffer,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
)


export default model('Message', messageSchema);