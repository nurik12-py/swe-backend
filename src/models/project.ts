import {Schema, ObjectId, model} from "mongoose";
import Joi, { number } from "joi";

export interface Project {
    _id: ObjectId,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    complated: boolean,
    members: ObjectId[],
    tasks: ObjectId[],
    createdBy: ObjectId,
}

const projectSchema = new Schema<Project>({
    name: {type: String, required: true, minlength: 1, maxlength: 50, trim: true},
    description: {type: String, required: true, minlength: 1, maxlength: 1000, trim: true},
    startDate: {type: Date, default: Date.now },
    endDate: {type: Date, required: true},
    complated: {type: Boolean, default: false},
    members: {type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: []},
    tasks: {type: [{ type: Schema.Types.ObjectId, ref: 'Task' }], default: []},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

export const validateProject = (project: Project) => {
    const schema = Joi.object({
      name: Joi.string().min(1).max(50).required(),
      description: Joi.string().min(1).max(1000).required(),
      startDate: Joi.date(),
      endDate: Joi.date().required(),
      complated: Joi.boolean(),
      members: Joi.array(),
      tasks: Joi.array(),
      createdBy: Joi.string(),
    });

    return schema.validate(project);
}

export const ProjectSchema = model("Project", projectSchema);