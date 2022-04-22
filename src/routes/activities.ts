import { NextFunction, Response, Router } from 'express';
import admin from '../middleware/admin';
import auth from '../middleware/auth';
import { ActivitySchema as Activity, validateActivity } from '../models/activity';
import AuthorizedRequest from '../types/AuthorizedRequest';

const router = Router();

router.get("/", [auth, admin], async (req: AuthorizedRequest, res: Response) => {
    const activities = await Activity.find();
    return res.send(activities);
});

router.get("/:id", [auth, admin], async (req: AuthorizedRequest, res: Response) => {
    const activities = Activity.findById(req.params.id);
    if(!activities) return res.status(404).send();

    return res.send(activities);
});

router.post("/", [auth, admin], async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
        const { error } = validateActivity(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
        const activities = await new Activity(req.body).save();

        return res.status(201).send(activities);
    } catch(error) {
        next(error);
    }
});

router.patch("/:id", [auth, admin], async (req: AuthorizedRequest, res: Response) => {
    const {error} = validateActivity(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const udpatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body);
    return res.send(udpatedActivity);
});

router.delete("/:id", [auth, admin], async (req: AuthorizedRequest, res: Response) => {
    const deletedActivity = await Activity.deleteOne({_id: req.params.id});
    return res.send(deletedActivity);
});

export default router;