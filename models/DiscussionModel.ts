import mongoose, {Schema, Types, model} from "mongoose";

export interface IDiscussionModel {
    members: [Types.ObjectId],
    projectId: Types.ObjectId
}

const discussionSchema = new Schema<IDiscussionModel>({
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})



export default model('Discussion', discussionSchema);