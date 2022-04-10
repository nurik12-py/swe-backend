import {Request} from 'express';

export interface JWTPayload {
    _id: string, 
    admin: boolean
}

export default interface AuthorizedRequest extends Request {
    user?: JWTPayload,
}