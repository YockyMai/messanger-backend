"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Models_1 = require("../Models");
class UserController {
    constructor(io) {
        this.io = io;
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            Models_1.UserModel.findById(id, (err, user) => {
                if (err)
                    return res.status(404).json({
                        message: 'User not found',
                    });
                res.send(user);
            });
        });
    }
    getUsersByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = req.params.username;
            const limit = req.params.limit;
            console.log(limit);
            Models_1.UserModel.find({
                $and: [{ fullname: { $regex: username, $options: 'i' } }],
            })
                .limit(Number(limit))
                .exec((err, users) => {
                if (err)
                    return res.status(404).json({
                        message: 'Users not found',
                    });
                console.log(users);
                return res.json(users);
            });
        });
    }
    getMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.user._id;
            Models_1.UserModel.findById(id, (err, user) => {
                if (err)
                    return res.status(404).json({
                        message: 'User not found',
                    });
                res.send(user);
            });
        });
    }
    delete(req, res) {
        const _id = req.params.id;
        Models_1.UserModel.findByIdAndRemove(_id, (err, doc) => {
            if (err) {
                return res.status(404).json({
                    message: 'User not found',
                });
            }
            console.log(doc);
            return res.status(200).json({
                message: 'User deleted successfully',
            });
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map