import mongoose, {Schema, Document, Types, model} from "mongoose";
import {NextFunction} from "express";


interface ITaskModel extends Document {
    title: string,
    assignees: [],
    currentStatus: string,
    startTime: Date,
    endTime: Date,
    projectId: Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date
}

const taskSchema = new Schema<ITaskModel>({
    title: {
        type: String,
        required: [true, "Please provide task title"],
        maxLength: 60
    },
    assignees: [{type: Types.ObjectId, ref: "User"}],
    currentStatus: {
        type: String,
        enum: ['todo', 'in progress', 'under review', 'completed'],
        default: () => 'todo'
    },
    startTime: Date,
    endTime: Date,
    projectId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Project"
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}}
)

taskSchema.pre('save', async function (next) {
    console.log('weeee')
    console.log(this.title)
    next();
});

export default model('Task', taskSchema);