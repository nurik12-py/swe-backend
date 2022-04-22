import {JwtPayload, verify} from 'jsonwebtoken';
import {Response, NextFunction} from 'express';
import AuthorizedRequest from '../types/AuthorizedRequest';


export default (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    const token = req.headers['x-auth-token'] as string;
    if (!token) return res.status(401).send("Access deined. No token provided.");
    try {
        const {_id, admin} = verify(token!, "somesecret") as JwtPayload;
        req.user = {_id, admin};
        next();
    } catch (ex) {
        return res.status(400).send("Invalid token.");
    }
}