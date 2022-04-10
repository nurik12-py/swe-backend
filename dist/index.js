"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./bootstrap/db"));
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
(0, db_1.default)();
(0, routes_1.default)(app);
const PORT = 4000;
app.listen(process.env.PORT || PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
