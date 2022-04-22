import {NextFunction, Response, Router} from 'express';
import admin from '../middleware/admin';
import auth from '../middleware/auth';
import {ProjectSchema as Project, validateProject} from '../models/project';
import AuthorizedRequest from '../types/AuthorizedRequest';

const router = Router();

router.get("/", [auth, admin], async (req: AuthorizedRequest, res: Response) => {
    const projects = await Project.find();
    return res.send(projects);
});

router.get("/:id", [auth], async (req: AuthorizedRequest, res: Response) => {
    const project = await Project.findById(req.params.id).populate("createdBy", "-password").populate("members", "-password").populate("tasks");
    if(!project) return res.status(404).send();

    return res.send(project);
});

router.post("/", [auth, admin], async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
        const { error } = validateProject(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        console.log(req.body);
        const project = await new Project({...req.body, createdBy: req.user!._id}).save();
        return res.status(201).send(project);
    } catch(error) {
        next(error);
    }
});

router.patch("/:id", [auth], async (req: AuthorizedRequest, res: Response) => {
    const {error} = validateProject(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const udpatedProject = await Project.findByIdAndUpdate(req.params.id, req.body);
    return res.send(udpatedProject);
});

router.delete("/:id", [auth], async (req: AuthorizedRequest, res: Response) => {
    const deletedProject = await Project.deleteOne({_id: req.params.id});
    return res.send(deletedProject);
});


export default router;