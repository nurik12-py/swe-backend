"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("../middleware/admin"));
const auth_1 = __importDefault(require("../middleware/auth"));
const activity_1 = require("../models/activity");
const router = (0, express_1.Router)();
router.get("/", [auth_1.default, admin_1.default], async (req, res) => {
    const activities = await activity_1.ActivitySchema.find();
    return res.send(activities);
});
router.get("/:id", [auth_1.default, admin_1.default], async (req, res) => {
    const activities = activity_1.ActivitySchema.findById(req.params.id);
    if (!activities)
        return res.status(404).send();
    return res.send(activities);
});
router.post("/", [auth_1.default, admin_1.default], async (req, res, next) => {
    try {
        const { error } = (0, activity_1.validateActivity)(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const activities = await new activity_1.ActivitySchema(req.body).save();
        return res.status(201).send(activities);
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id", [auth_1.default, admin_1.default], async (req, res) => {
    const { error } = (0, activity_1.validateActivity)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const udpatedActivity = await activity_1.ActivitySchema.findByIdAndUpdate(req.params.id, req.body);
    return res.send(udpatedActivity);
});
router.delete("/:id", [auth_1.default, admin_1.default], async (req, res) => {
    const deletedActivity = await activity_1.ActivitySchema.deleteOne({ _id: req.params.id });
    return res.send(deletedActivity);
});
exports.default = router;
