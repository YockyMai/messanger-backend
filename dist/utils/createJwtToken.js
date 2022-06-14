"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = require("lodash");
exports.default = (user) => {
    const data = (0, lodash_1.reduce)(user, (result, value, key) => {
        if (key !== 'password') {
            result[key] = value;
        }
        return result;
    }, {});
    let token = jsonwebtoken_1.default.sign({
        data,
    }, process.env.JWT_SECRET, {
        expiresIn: '2 days',
    });
    return token;
};
//# sourceMappingURL=createJwtToken.js.map