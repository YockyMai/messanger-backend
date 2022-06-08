"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialogValidator = void 0;
const validator_1 = __importDefault(require("validator"));
class dialogValidator {
    createDialog(author, partner, text) {
        if (validator_1.default.isEmpty(author) ||
            validator_1.default.isEmpty(partner) ||
            validator_1.default.isEmpty(text)) {
            return false;
        }
        else {
            return true;
        }
    }
}
exports.dialogValidator = dialogValidator;
//# sourceMappingURL=dialog.js.map