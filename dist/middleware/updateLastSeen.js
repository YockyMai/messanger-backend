"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Models_1 = require("../Models");
exports.default = (req, res, next) => {
    Models_1.UserModel.updateOne({ _id: '628905ae0d62a56dd309ad71' }, { $set: { last_seen: new Date() } });
    next();
};
//# sourceMappingURL=updateLastSeen.js.map