"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifyJwtToken_1 = __importDefault(require("../utils/verifyJwtToken"));
// interface IGetUserRequest extends Request {
// 	user: any;
// }
exports.default = (req, res, next) => {
    const token = req.headers.token;
    if (req.path === '/user/login' || req.path === '/user/registration') {
        return next();
    }
    if (token) {
        (0, verifyJwtToken_1.default)(token)
            .then(user => {
            req.user = user.data._doc;
            next();
        })
            .catch(() => {
            res.status(404).json({
                message: 'Invalid auth token',
            });
        });
    }
};
//# sourceMappingURL=checkAuth.js.map