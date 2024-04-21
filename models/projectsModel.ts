import mongoose, { Schema, Document, Types, model } from "mongoose";



interface IProjectModel extends Document {
    name: string,
    teamMembers: Types.ObjectId[],
    // tasks: Types.ObjectId[],
    customerId: Types.ObjectId,
    status: string,
    startDate: Date,
    dueDate: Date,
    endDate: Date
}


const projectSchema = new Schema<IProjectModel>({
    name: {
        type: String,
        maxLength: 60
    },
    teamMembers: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ['completed', 'ongoing', 'abandoned', 'not yet started', 'on hold'],

    },
    startDate: {
        type: mongoose.Schema.Types.Date,
        default: new Date()
    },
    dueDate: {
        type: mongoose.Schema.Types.Date,
    },
    endDate: mongoose.Schema.Types.Date
}, {
    timestamps: true,
    toJSON: { virtuals: true},
    toObject: { virtuals: true }
})

// TODO 2: HANDLE DELETE TASKS AND DISCUSSION ASSOCIATED WITH DELETED PROJECT
projectSchema.pre('deleteOne', async function (this: IProjectModel, next) {
    // await TasksModel.deleteMany({projectId: this._id});
    console.log("Pre delete one of project");
    console.log(this._id);
    next();
})
export default model('Project', projectSchema);