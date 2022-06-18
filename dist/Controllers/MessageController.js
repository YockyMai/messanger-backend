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
class MessageController {
    constructor(io) {
        this.index = (req, res) => {
            const dialogID = req.params.id;
            Models_1.MessageModel.find({ dialog: dialogID })
                .populate(['dialog', 'user'])
                .exec((err, message) => {
                if (err)
                    return res.status(404).json({
                        err,
                    });
                return res.json(message);
            });
        };
        this.findByText = (req, res) => {
            const text = req.params.text;
            const dialogID = req.params.dialog;
            Models_1.MessageModel.find({
                $and: [
                    { text: { $regex: text, $options: 'i' } },
                    { dialog: dialogID },
                ],
            }, (err, messages) => {
                if (err) {
                    return res.json(err);
                }
                return res.json({
                    messages,
                });
            });
        };
        this.create = (req, res) => {
            const { text, dialogID } = req.body;
            const userId = req.user._id;
            const message = new Models_1.MessageModel({
                text,
                user: userId,
                dialog: dialogID,
            });
            message
                .save()
                .then((message) => {
                message.populate(['dialog', 'user'], (err, message) => {
                    if (err) {
                        return res.status(500).json({
                            message: err,
                        });
                    }
                    Models_1.DialogModel.findByIdAndUpdate(message.dialog._id, {
                        lastMessage: message._id,
                    }, (err, dialog) => {
                        res.json(message);
                        this.io.emit('SERVER:NEW_MESSAGE', {
                            message,
                            dialog,
                        });
                    });
                });
            })
                .catch(err => {
                return res.json({
                    err,
                });
            });
        };
        this.delete = (req, res) => {
            const _id = req.params.id;
            Models_1.MessageModel.findByIdAndRemove(_id, (err, message) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(404).json({
                        message: `Message not found`,
                    });
                }
                const lastMsg = yield Models_1.MessageModel.find({
                    dialog: message.dialog,
                })
                    .populate(['dialog', 'user'])
                    .limit(1)
                    .sort({ $natural: -1 });
                console.log(lastMsg);
                if (lastMsg.length <= 0) {
                    Models_1.DialogModel.findByIdAndUpdate(message.dialog, { $unset: { lastMessage: 1 } }, (err, dialog) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log(dialog);
                        this.io.emit('SERVER:DELETE_MESSAGE', {
                            message,
                        });
                        return res.json({
                            message: `Message "${message.text}" deleted successfully`,
                        });
                    });
                }
                else {
                    Models_1.DialogModel.findByIdAndUpdate(message.dialog, { lastMessage: lastMsg[0]._id }, (err, dialog) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log(dialog);
                        this.io.emit('SERVER:DELETE_MESSAGE', {
                            message,
                            lastMsg,
                        });
                        return res.json({
                            message: `Message "${message.text}" deleted successfully`,
                        });
                    });
                }
            }));
        };
        this.clearChatMessages = (req, res) => {
            const dialogID = req.params.id;
            Models_1.MessageModel.deleteMany({ dialog: dialogID }, (err, deletedMessages) => {
                if (err) {
                    return res.status(404).json({
                        message: 'messages with current dialogId not found',
                    });
                }
                this.io.emit('SERVER:DELETE_ALL_MESSAGES', deletedMessages);
            });
        };
        this.updateMessage = (req, res) => {
            const { text, id } = req.body;
            Models_1.MessageModel.findByIdAndUpdate(id, { text: text, updated: true }, (err, updatedMessage) => {
                if (err) {
                    return res.status(404).json({
                        message: 'messages not found',
                    });
                }
                Models_1.MessageModel.find({ _id: updatedMessage._id })
                    .populate(['dialog', 'user'])
                    .exec((err, message) => {
                    if (err) {
                        console.log(err);
                    }
                    this.io.emit('SERVER:UPDATE_MESSAGE', message[0]);
                    return res.json({
                        message: message[0],
                    });
                });
            });
        };
        this.io = io;
    }
}
exports.default = MessageController;
//# sourceMappingURL=MessageController.js.map