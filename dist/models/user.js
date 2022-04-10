"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.validateUser = void 0;
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = require("jsonwebtoken");
const joi_1 = __importDefault(require("joi"));
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, minlength: 1, maxlength: 30, trim: true },
    lastName: { type: String, required: true, minlength: 1, maxlength: 30, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true, trim: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
    password: { type: String, required: true, match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password is weak'] },
    avatar: { type: String, maxlength: 1024 },
    admin: { type: Boolean, default: false },
    role: { type: String, required: true }
});
userSchema.methods["generateAuthToken"] = function () {
    const token = (0, jsonwebtoken_1.sign)({ _id: this._id, admin: this.admin, avatar: this.avatar }, "somesecret");
    return token;
};
const validateUser = (user) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().min(1).max(30).required(),
        lastName: joi_1.default.string().min(1).max(30).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required(),
        avatar: joi_1.default.string().max(1000),
        admin: joi_1.default.boolean(),
        role: joi_1.default.string()
    });
    return schema.validate(user);
};
exports.validateUser = validateUser;
exports.UserSchema = (0, mongoose_1.model)("User", userSchema);
