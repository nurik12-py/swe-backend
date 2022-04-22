"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("../middleware/admin"));
const auth_1 = __importDefault(require("../middleware/auth"));
const task_1 = require("../models/task");
const project_1 = require("../models/project");
const router = (0, express_1.Router)();
router.get("/", [auth_1.default], async (req, res) => {
    const tasks = await task_1.TaskSchema.find();
    return res.send(tasks);
});
router.get("/assigned/:id", [auth_1.default], async (req, res) => {
    const tasks = await task_1.TaskSchema.find({ members: req.params.id });
    if (!tasks)
        return res.status(404).send();
    return res.send(tasks);
});
router.get("/:id", [auth_1.default], async (req, res) => {
    const task = task_1.TaskSchema.findById(req.params.id);
    if (!task)
        return res.status(404).send();
    return res.send(task);
});
router.post("/", [auth_1.default], async (req, res, next) => {
    try {
        const { error } = (0, task_1.validateTask)(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const task = await new task_1.TaskSchema(req.body).save();
        const project = await project_1.ProjectSchema.findById(req.body.projectId);
        if (!project)
            return res.status(400).send("Project associated by this task not found");
        project.tasks.push(task._id);
        await project.save();
        return res.status(201).send(task);
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id", [auth_1.default], async (req, res) => {
    // const {error} = validateTask(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    const udpatedtask = await task_1.TaskSchema.findByIdAndUpdate(req.params.id, req.body);
    return res.send(udpatedtask);
});
router.delete("/:id", [auth_1.default, admin_1.default], async (req, res) => {
    const deletedtask = await task_1.TaskSchema.deleteOne({ _id: req.params.id });
    return res.send(deletedtask);
});
exports.default = router;
