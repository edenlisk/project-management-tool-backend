import { Schema, InferSchemaType, model } from "mongoose";
import isEmail from "validator/lib/isEmail";


// interface UserSchema {
//     name: string;
//     email: string;
//     password: string;
//     passwordConfirm: string;
//     role: 'user' | 'admin';
// }

const userSchema = new Schema({
    name: {
        type: String,
        minLength: 5,
        maxLength: 50,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        minLength: 5,
        maxLength: 20,
        required: [true, 'Please provide email address'],
        validate: [isEmail, "Please provide valid Email address"]
    },
    password: {
        type: String,
        minLength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin']
    }
})

type User = InferSchemaType<typeof userSchema>;



export default model('User', userSchema);
