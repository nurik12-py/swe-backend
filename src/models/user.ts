import {Schema, ObjectId, model} from "mongoose";
import {sign} from 'jsonwebtoken';
import Joi from "joi";

export interface User {
    _id: ObjectId,
    firstName: string, 
    lastName: string,
    email: string,
    password: string,
    avatar: string,
    admin: boolean,
    role: string,
    generateAuthToken: () => string;
}

const userSchema = new Schema<User>({
    firstName: {type: String, required: true, minlength: 1, maxlength: 30, trim: true},
    lastName: {type: String, required: true, minlength: 1, maxlength: 30, trim: true},
    email: {type: String, required: true, lowercase: true, unique: true, trim: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
    password: {type: String, required: true, match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password is weak']},
    avatar: {type: String, maxlength: 1024},
    admin: {type: Boolean, default: false},
    role: {type: String, required: true}
});


userSchema.methods["generateAuthToken"] = function () {
    const token = sign({ _id: this._id, admin: this.admin, avatar: this.avatar }, "somesecret");
    return token;
}

export const validateUser = (user: User) => {
    const schema = Joi.object({
      firstName: Joi.string().min(1).max(30).required(),
      lastName: Joi.string().min(1).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required(),
      avatar: Joi.string().max(1000),
      admin: Joi.boolean(),
      role: Joi.string()
    });

    return schema.validate(user);
}

export const UserSchema = model("User", userSchema);