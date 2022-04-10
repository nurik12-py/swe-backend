import Joi from "joi";
import {Schema, ObjectId, model} from "mongoose";

export interface Task {
    _id: ObjectId,
    name: string, 
    description: string,
    startDate: Date,
    endDate: Date,
    complated: boolean,
    members: ObjectId[],
    projectId: ObjectId
}

const taskSchema = new Schema<Task>({
    name: {type: String, required: true, minlength: 1, maxlength: 50, trim: true},
    description: {type: String, required: true, minlength: 1, maxlength: 1000, trim: true},
    startDate: {type: Date, required: true },
    endDate: {type: Date, required: true},
    complated: {type: Boolean, default: false},
    members: {type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: []},
    projectId: { type: Schema.Types.ObjectId, ref: 'User' } 
});

export const validateTask = (project: Task) => {
    const schema = Joi.object({
      name: Joi.string().min(1).max(50).required(),
      description: Joi.string().min(1).max(1000).required(),
      startDate: Joi.date(),
      endDate: Joi.date().required(),
      complated: Joi.boolean(),
      members: Joi.array(),
      projectId: Joi.string(),
    });

    return schema.validate(project);
}

export const TaskSchema = model("Task", taskSchema);