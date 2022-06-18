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
class DialogController {
    constructor(io) {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { partner, text } = req.body;
            const author = req.user._id;
            const existAuthor = yield Models_1.UserModel.findById(author);
            const existPartner = yield Models_1.UserModel.findById(partner);
            const Dialog = new Models_1.DialogModel({ author, partner });
            if (existAuthor && existPartner) {
                Dialog.save()
                    .then(dialog => {
                    Models_1.DialogModel.findById(dialog._id)
                        .populate(['author', 'partner'])
                        .exec((err, dialogs) => {
                        if (err) {
                            return res.status(404).json({ message: err });
                        }
                        const Message = new Models_1.MessageModel({
                            text,
                            dialog: dialog._id,
                            user: author,
                        });
                        Message.save().then((messageObj) => {
                            dialogs.lastMessage = messageObj._id;
                            dialogs.save().then(() => {
                                const dialogObj = dialogs;
                                dialogObj.lastMessage = messageObj;
                                this.io.emit('SERVER:DIALOG_CREATED', {
                                    contributors: {
                                        partner,
                                        author,
                                    },
                                    messageObj,
                                    dialogs,
                                });
                                return res.json({
                                    messageObj,
                                    dialogs,
                                });
                            });
                        });
                    });
                })
                    .catch(err => {
                    return res.status(400).json({
                        err,
                    });
                });
            }
            else {
                return res.status(404).json({
                    message: 'Users not found',
                });
            }
        });
        this.io = io;
    }
    index(req, res) {
        // const { user } = req.body.user;
        const userID = req.user._id;
        console.log(userID);
        Models_1.DialogModel.find({ $or: [{ author: userID }, { partner: userID }] })
            .populate(['author', 'partner', 'lastMessage'])
            .exec((err, dialogs) => {
            if (err) {
                return res.status(404).json({ message: err });
            }
            return res.json(dialogs);
        });
    }
}
exports.default = DialogController;
//# sourceMappingURL=DialogController.js.map