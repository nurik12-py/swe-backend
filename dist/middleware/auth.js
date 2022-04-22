"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
exports.default = (req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (!token)
        return res.status(401).send("Access deined. No token provided.");
    try {
        const { _id, admin } = (0, jsonwebtoken_1.verify)(token, "somesecret");
        req.user = { _id, admin };
        next();
    }
    catch (ex) {
        return res.status(400).send("Invalid token.");
    }
};
