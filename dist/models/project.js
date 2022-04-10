"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSchema = exports.validateProject = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const projectSchema = new mongoose_1.Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 50, trim: true },
    description: { type: String, required: true, minlength: 1, maxlength: 1000, trim: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    complated: { type: Boolean, default: false },
    members: { type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }], default: [] },
    tasks: { type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Task' }], default: [] },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
});
const validateProject = (project) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(1).max(50).required(),
        description: joi_1.default.string().min(1).max(1000).required(),
        startDate: joi_1.default.date(),
        endDate: joi_1.default.date().required(),
        complated: joi_1.default.boolean(),
        members: joi_1.default.array(),
        tasks: joi_1.default.array(),
        createdBy: joi_1.default.string(),
    });
    return schema.validate(project);
};
exports.validateProject = validateProject;
exports.ProjectSchema = (0, mongoose_1.model)("Project", projectSchema);
