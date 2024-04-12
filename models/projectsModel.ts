import mongoose, { Schema, Document, Types, model } from "mongoose";



interface IProjectModel extends Document {
    name: string,
    users: Types.ObjectId[],
    tasks: Types.ObjectId[],
    customerId: Types.ObjectId
}


const projectSchema = new Schema<IProjectModel>({
    name: {
        type: String,
        maxLength: 60
    },
    users: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    tasks: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Task"
            }
        ]
    },
    customerId: mongoose.Types.ObjectId
}, {
    timestamps: true,
    toJSON: { virtuals: true},
    toObject: { virtuals: true }
})

export default model('Project', projectSchema);