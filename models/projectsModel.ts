import mongoose, { Schema, Document, Types, model } from "mongoose";
import TasksModel, {ITaskModel} from "./tasksModel";



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


projectSchema.pre('deleteOne', async function (this: ITaskModel, next) {
    await TasksModel.deleteMany({projectId: this._id});
    next();
})
export default model('Project', projectSchema);