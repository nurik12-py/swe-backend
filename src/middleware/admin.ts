import {Response, NextFunction} from 'express';
import AuthorizedRequest from '../types/AuthorizedRequest';


export default (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    if(!req.user?.admin) return res.status(403).send("Access deined.");
    
    next();
}

