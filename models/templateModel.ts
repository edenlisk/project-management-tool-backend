import { Schema, model, Document } from 'mongoose';


export interface IProjectTemplate extends Document{
    name: string
}

const templateSchema = new Schema<IProjectTemplate>(
    {
        name: {
            type: String,
            unique: true,
            required: [true, "Please provide template name"]
        }
    },
    {
        timestamps: true
    }
)

export default model('Template', templateSchema);