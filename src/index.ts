import express from "express";
import db from "./bootstrap/db";
import routes from './routes/routes';

const app = express();

db();
routes(app);

const PORT = 4000;
app.listen(process.env.PORT || PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});