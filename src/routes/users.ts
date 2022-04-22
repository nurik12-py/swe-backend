import {NextFunction, Response, Router} from 'express';
import {UserSchema as User, validateUser} from '../models/user';
import {genSalt, hash} from 'bcrypt';
import _ from 'lodash';
import auth from '../middleware/auth';
import AuthorizedRequest from '../types/AuthorizedRequest';
import {Types} from 'mongoose';
import admin from '../middleware/admin';

const router = Router();


router.get("/", [auth], async (req: AuthorizedRequest, res: Response) => {
    const users = await User.find().select("-password");
    return res.send(users);
});


router.get("/me", [auth], async (req: AuthorizedRequest, res: Response) => {
    const user = await User.findById(req.user?._id).select("-password");
    if(!user) return res.status(404).send();

    return res.send(user);
});

router.post("/", [auth, admin], async (req: AuthorizedRequest, res: Response, next: NextFunction) => { 
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
        const exstingUser = await User.findOne({ email: req.body.email })
        if (exstingUser) return res.status(400).send("User with this email already exists!");
    
        const user = new User(req.body);
        console.log(req.body);
        const salt = await genSalt(10);
        user.password = await hash(user.password, salt);
        
        await user.save();
    
        const token = user.generateAuthToken();
        res.header("x-auth-token", token).header("access-control-expose-headers", "x-auth-token");
        
        return res.status(201).send(user);
    } catch(error) {
        next(error);
    }
});

router.get("/:id", [auth], async (req: AuthorizedRequest, res: Response) => {
    if(!req.params.id) return res.status(400).send();
    const user = await User.findById(req.params.id).select("-password");
    
    if(!user) return res.status(404).send();

    return res.send(user);
});

router.patch("/:id", [auth], async (req: AuthorizedRequest, res: Response) => {
    const userId = req.params.id;
    if(!Types.ObjectId.isValid(userId)) return res.status(400).send();
    if(!req.user?.admin && userId !== req.user?._id) return res.status(403).send("Access denied");

    const updatedUser = await User.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
    return res.send(updatedUser);
});

router.delete("/:id", [auth, admin], async (req: AuthorizedRequest, res: Response) => {
    console.log(req.params.id);
    const deletedUser = await User.deleteOne({_id: req.params.id});
    return res.send(deletedUser);
});

export default router;