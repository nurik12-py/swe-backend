"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../models/user");
const bcrypt_1 = require("bcrypt");
const auth_1 = __importDefault(require("../middleware/auth"));
const mongoose_1 = require("mongoose");
const admin_1 = __importDefault(require("../middleware/admin"));
const router = (0, express_1.Router)();
router.get("/", [auth_1.default], async (req, res) => {
    const users = await user_1.UserSchema.find().select("-password");
    return res.send(users);
});
router.get("/me", [auth_1.default], async (req, res) => {
    var _a;
    const user = await user_1.UserSchema.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select("-password");
    if (!user)
        return res.status(404).send();
    return res.send(user);
});
router.post("/", [auth_1.default, admin_1.default], async (req, res, next) => {
    try {
        const { error } = (0, user_1.validateUser)(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const exstingUser = await user_1.UserSchema.findOne({ email: req.body.email });
        if (exstingUser)
            return res.status(400).send("User with this email already exists!");
        const user = new user_1.UserSchema(req.body);
        console.log(req.body);
        const salt = await (0, bcrypt_1.genSalt)(10);
        user.password = await (0, bcrypt_1.hash)(user.password, salt);
        await user.save();
        const token = user.generateAuthToken();
        res.header("x-auth-token", token).header("access-control-expose-headers", "x-auth-token");
        return res.status(201).send(user);
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id", [auth_1.default], async (req, res) => {
    if (!req.params.id)
        return res.status(400).send();
    const user = await user_1.UserSchema.findById(req.params.id).select("-password");
    if (!user)
        return res.status(404).send();
    return res.send(user);
});
router.patch("/:id", [auth_1.default], async (req, res) => {
    var _a, _b;
    const userId = req.params.id;
    if (!mongoose_1.Types.ObjectId.isValid(userId))
        return res.status(400).send();
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.admin) && userId !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id))
        return res.status(403).send("Access denied");
    const updatedUser = await user_1.UserSchema.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
    return res.send(updatedUser);
});
router.delete("/:id", [auth_1.default, admin_1.default], async (req, res) => {
    console.log(req.params.id);
    const deletedUser = await user_1.UserSchema.deleteOne({ _id: req.params.id });
    return res.send(deletedUser);
});
exports.default = router;
