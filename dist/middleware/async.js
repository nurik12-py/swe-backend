"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncMiddleware(handler) {
    return async (res, req, next) => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            next(ex);
        }
    };
}
exports.default = asyncMiddleware;
;
