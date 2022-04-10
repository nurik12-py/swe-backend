import Joi from 'joi';
import {Schema, ObjectId, model} from "mongoose";

export interface Activity {
    _id: ObjectId, 
    name: string,
    description: string,
    complated: boolean,
    members: ObjectId[],
}

const activitySchema = new Schema<Activity>({
    name: {type: String, required: true, minlength: 1, maxlength: 50, trim: true},
    description: {type: String, required: true, minlength: 1, maxlength: 1000, trim: true},
    complated: {type: Boolean, default: false},
    members: {type: [String], default: []},
});

export const validateActivity = (project: Activity) => {
    const schema = Joi.object({
      name: Joi.string().min(1).max(50).required(),
      description: Joi.string().min(1).max(1000).required(),
      complated: Joi.boolean(),
      members: Joi.array(),
    });

    return schema.validate(project);
}

export const ActivitySchema = model("Activity", activitySchema);
