import { Router } from "express";
import { UserSchema as User } from "../models/user";
import Joi from "joi";
import {compare} from "bcrypt";

const router = Router();

interface LoginCredentials {
    email: string, 
    password: string
}

const validate = (body: LoginCredentials) => {
    const schema = Joi.object({
        password: Joi.string().required(),
        email: Joi.string().email().required()
    });
    return schema.validate(body);
}

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res.send(token);
});

export default router;