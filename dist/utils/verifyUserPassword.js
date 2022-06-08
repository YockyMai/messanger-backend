"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = (reqPassword, userPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.compare(reqPassword, userPassword).then(function (result) {
            if (!result) {
                reject();
            }
            resolve(result);
        });
    });
};
//# sourceMappingURL=verifyUserPassword.js.map