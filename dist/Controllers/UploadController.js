"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Models_1 = require("../Models");
class UserController {
    constructor() {
        this.create = (req, res) => {
            const qwe = JSON.stringify(req.file);
            const qwerty = JSON.parse(qwe);
            console.log(qwerty);
        };
        this.createAvatarPhoto = (req, res) => {
            const userId = req.user._id;
            const file = req.file;
            Models_1.UserModel.findByIdAndUpdate(userId, { avatar: file.path }, (err, doc) => {
                if (err) {
                    return res.json({
                        message: err,
                        status: 'error',
                    });
                }
                console.log(doc);
                return res.json({
                    path: file.path,
                });
            });
        };
    }
    delete() { }
}
exports.default = UserController;
//# sourceMappingURL=UploadController.js.map