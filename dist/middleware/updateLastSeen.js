"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Models_1 = require("../Models");
exports.default = (req, res, next) => {
    if (req.user) {
        Models_1.UserModel.findOneAndUpdate({ _id: req.user.id }, {
            last_seen: new Date(),
        }, { new: true });
    }
    next();
};
//# sourceMappingURL=updateLastSeen.js.map