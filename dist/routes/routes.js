"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = __importDefault(require("../middleware/error"));
const users_1 = __importDefault(require("./users"));
const auth_1 = __importDefault(require("./auth"));
const projects_1 = __importDefault(require("./projects"));
const tasks_1 = __importDefault(require("./tasks"));
const activities_1 = __importDefault(require("./activities"));
exports.default = (app) => {
    app.use((0, cors_1.default)());
    app.use((0, express_1.json)());
    app.use((0, morgan_1.default)('dev'));
    app.use("/api/users", users_1.default);
    app.use("/api/auth", auth_1.default);
    app.use("/api/projects", projects_1.default);
    app.use("/api/tasks", tasks_1.default);
    app.use("/api/activities", activities_1.default);
    app.use(error_1.default);
};
