import { Express, json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import error from '../middleware/error';
import users from './users';
import auth from './auth';
import projects from './projects';
import tasks from './tasks';
import activities from "./activities";

export default (app: Express) => {
    app.use(cors());
    app.use(json());
    app.use(morgan('dev'));
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use("/api/projects", projects);
    app.use("/api/tasks", tasks);
    app.use("/api/activities", activities);
    app.use(error);
};
