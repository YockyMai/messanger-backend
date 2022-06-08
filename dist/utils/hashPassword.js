"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
exports.default = bcrypt_1.default.genSalt(saltRounds, function (err, salt) {
    bcrypt_1.default.hash(process.env.BCRYPT_HASH, salt, function (err, hash) {
        // Store hash in your password DB.
    });
});
//# sourceMappingURL=hashPassword.js.map