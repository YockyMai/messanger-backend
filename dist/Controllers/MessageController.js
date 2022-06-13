"use strict";
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
                    res.json(message);
                    this.io.emit('SERVER:NEW_MESSAGE', message);
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
            Models_1.MessageModel.findByIdAndRemove(_id, (err, message) => {
                if (err) {
                    return res.status(404).json({
                        message: `Message ${message.text} not found`,
                    });
                }
                this.io.emit('SERVER:DELETE_MESSAGE', message);
                return res.json({
                    message: `Message "${message.text}" deleted successfully`,
                });
            });
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
        this.io = io;
    }
}
exports.default = MessageController;
//# sourceMappingURL=MessageController.js.map