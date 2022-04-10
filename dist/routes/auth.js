"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../models/user");
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = require("bcrypt");
const router = (0, express_1.Router)();
const validate = (body) => {
    const schema = joi_1.default.object({
        password: joi_1.default.string().required(),
        email: joi_1.default.string().email().required()
    });
    return schema.validate(body);
};
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = await user_1.UserSchema.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send("Invalid email or password");
    const validPassword = await (0, bcrypt_1.compare)(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).send("Invalid email or password");
    const token = user.generateAuthToken();
    res.send(token);
});
exports.default = router;
