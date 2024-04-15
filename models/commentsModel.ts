import mongoose, {Schema, Types, model} from "mongoose";


export interface ICommentsModel {
    userId: Types.ObjectId,
    taskId: Types.ObjectId,
    commentText: string
}

const commentSchema = new Schema<ICommentsModel>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    commentText: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


export default model('Comment', commentSchema);



