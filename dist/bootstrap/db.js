"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = () => {
    (0, mongoose_1.connect)("mongodb+srv://nurikuser:aAhgqHgx3zJ9UM2@cluster0.lso8k.mongodb.net/test?retryWrites=true&w=majority")
        .then(() => console.log("Connected to db"))
        .catch((error) => console.error(error));
};
