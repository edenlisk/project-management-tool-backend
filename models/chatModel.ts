import mongoose, { Schema, Types, model } from "mongoose";


export interface IChatModel {
    members: Types.Array<Types.ObjectId>
}


const chatSchema = new Schema<IChatModel>(
    {
        members: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            ],
            unique: true,
            validate: [
                {
                    validator: function (arr: Types.ObjectId[]) {
                        return arr.length === 2;
                    },
                    message: "Members of chat cannot exceed two"
                },
                {
                    validator: function (arr: Types.ObjectId[]) {
                        arr.sort();
                        return !arr[0].equals(arr[1]);
                    },
                    message: "You cannot create chat with yourself"
                }
            ]
        }
    }, {
        timestamps: true
    }
)

export default model("Chat", chatSchema);