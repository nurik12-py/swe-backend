"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("../middleware/admin"));
const auth_1 = __importDefault(require("../middleware/auth"));
const project_1 = require("../models/project");
const router = (0, express_1.Router)();
router.get("/", [auth_1.default, admin_1.default], async (req, res) => {
    const projects = await project_1.ProjectSchema.find();
    return res.send(projects);
});
router.get("/:id", [auth_1.default], async (req, res) => {
    const project = await project_1.ProjectSchema.findById(req.params.id).populate("createdBy", "-password").populate("members", "-password").populate("tasks");
    if (!project)
        return res.status(404).send();
    return res.send(project);
});
router.post("/", [auth_1.default, admin_1.default], async (req, res, next) => {
    try {
        const { error } = (0, project_1.validateProject)(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        console.log(req.body);
        const project = await new project_1.ProjectSchema({ ...req.body, createdBy: req.user._id }).save();
        return res.status(201).send(project);
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id", [auth_1.default], async (req, res) => {
    const { error } = (0, project_1.validateProject)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const udpatedProject = await project_1.ProjectSchema.findByIdAndUpdate(req.params.id, req.body);
    return res.send(udpatedProject);
});
router.delete("/:id", [auth_1.default], async (req, res) => {
    const deletedProject = await project_1.ProjectSchema.deleteOne({ _id: req.params.id });
    return res.send(deletedProject);
});
exports.default = router;
