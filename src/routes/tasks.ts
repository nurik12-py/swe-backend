import {NextFunction, Response, Router} from 'express';

import admin from '../middleware/admin';
import auth from '../middleware/auth';
import { TaskSchema as Task, validateTask } from '../models/task';
import { ProjectSchema as Project } from '../models/project';
import AuthorizedRequest from '../types/AuthorizedRequest';

const router = Router();


router.get("/", [auth], async (req: AuthorizedRequest, res: Response) => {
    const tasks = await Task.find();
    return res.send(tasks);
});

router.get("/assigned/:id", [auth], async (req: AuthorizedRequest, res: Response) => {
    const tasks = await Task.find({members: req.params.id});
    if(!tasks) return res.status(404).send();

    return res.send(tasks);
});

router.get("/:id", [auth], async (req: AuthorizedRequest, res: Response) => {
    const task = Task.findById(req.params.id);
    if(!task) return res.status(404).send();

    return res.send(task);
});

router.post("/", [auth], async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
        const { error } = validateTask(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
        const task = await new Task(req.body).save();
        const project = await Project.findById(req.body.projectId);

        if(!project) return res.status(400).send("Project associated by this task not found");

        project.tasks.push(task._id);
        await project.save()

        return res.status(201).send(task);
    } catch(error) {
        next(error);
    }
});

router.patch("/:id", [auth], async (req: AuthorizedRequest, res: Response) => {
    // const {error} = validateTask(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    const udpatedtask = await Task.findByIdAndUpdate(req.params.id, req.body);
    return res.send(udpatedtask);
});

router.delete("/:id", [auth, admin], async (req: AuthorizedRequest, res: Response) => {
    const deletedtask = await Task.deleteOne({_id: req.params.id});
    return res.send(deletedtask);
});

export default router;