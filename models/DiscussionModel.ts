import mongoose, {Schema, Types, model} from "mongoose";

export interface IDiscussionModel {
    members: [Types.ObjectId],
    projectId: Types.ObjectId
}

const discussionSchema = new Schema<IDiscussionModel>({
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        validate: [
            {
                validator: function(arr: Types.ObjectId[]) {
                    return arr.length === 2;
                },
                message: 'Members array must contain exactly two user IDs.'
            },
            {
                validator: function(arr: Types.ObjectId[]) {
                    arr.sort();
                    return arr[0] !== arr[1];
                },
                message: 'Members array must contain distinct user IDs.'
            }
        ]
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})



export default model('Discussion', discussionSchema);