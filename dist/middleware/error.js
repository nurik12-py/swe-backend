"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(err, req, res, next) {
    console.error(err);
    res.status(500).send(err);
}
exports.default = default_1;
;
