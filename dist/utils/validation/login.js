"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidator = void 0;
const validator_1 = __importDefault(require("validator"));
class LoginValidator {
    password(password) {
        if (validator_1.default.isStrongPassword(password, {
            minSymbols: 0,
        })) {
            return true;
        }
        return false;
    }
    email(email) {
        if (validator_1.default.isEmail(email)) {
            return true;
        }
        return false;
    }
    fullname(fullname) {
        if (fullname.length > 6)
            return true;
        else
            return false;
    }
}
exports.LoginValidator = LoginValidator;
//# sourceMappingURL=login.js.map