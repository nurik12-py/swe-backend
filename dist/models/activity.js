"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitySchema = exports.validateActivity = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 50, trim: true },
    description: { type: String, required: true, minlength: 1, maxlength: 1000, trim: true },
    complated: { type: Boolean, default: false },
    members: { type: [String], default: [] },
});
const validateActivity = (project) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(1).max(50).required(),
        description: joi_1.default.string().min(1).max(1000).required(),
        complated: joi_1.default.boolean(),
        members: joi_1.default.array(),
    });
    return schema.validate(project);
};
exports.validateActivity = validateActivity;
exports.ActivitySchema = (0, mongoose_1.model)("Activity", activitySchema);
