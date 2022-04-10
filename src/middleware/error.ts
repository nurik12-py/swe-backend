import {Errback, Request, Response, NextFunction} from 'express';

export default function (err: Errback, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(500).send(err);
};
