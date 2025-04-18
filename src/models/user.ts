import { model, Schema }  from "mongoose";

interface IUser {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

const userSchema = new Schema<IUser> ({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

export const User = model<IUser>('User', userSchema);