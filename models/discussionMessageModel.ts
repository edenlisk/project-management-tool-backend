import mongoose, {Schema, Types, model} from "mongoose";


export interface IDiscussionMessageModel {
    message: string | Types.Buffer,
    senderId: Types.ObjectId,
    discussionId: Types.ObjectId
}



const discussionMessageSchema = new Schema<IDiscussionMessageModel>(
    {
        message: {
            type: String || mongoose.Schema.Types.Buffer,
            required: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        discussionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Discussion"
        }
    }, {
        timestamps: true
    }
)


export default model("DiscussionMessage", discussionMessageSchema);