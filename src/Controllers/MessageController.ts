import { IMessage } from './../Models/Message';
import express from 'express';
import { DialogModel, MessageModel, UserModel } from '../Models';
import socket from 'socket.io';
declare module 'express' {
	export interface Request {
		user?: any;
	}
}

class MessageController {
	io: socket.Server; //inner types

	constructor(io: socket.Server) {
		this.io = io;
	}

	updateReadStatus = (
		res: express.Response,
		userId: string,
		dialogId: string,
	): void => {
		MessageModel.updateMany(
			{ dialog: dialogId, user: { $ne: userId } },
			{ $set: { unread: true } },
			(err: any): void => {
				if (err) {
					res.status(500).json({
						status: 'error',
						message: err,
					});
				} else {
					this.io.emit('SERVER:MESSAGES_READED', {
						userId,
						dialogId,
					});
				}
			},
		);
	};

	index = (req: express.Request, res: express.Response) => {
		const dialogID: string = req.params.id;

		const userID: string = req.user._id;

		this.updateReadStatus(res, userID, dialogID);

		MessageModel.find({ dialog: dialogID })
			.populate(['dialog', 'user'])
			.exec((err, message) => {
				if (err)
					return res.status(404).json({
						err,
					});
				return res.json(message);
			});
	};
	findByText = (req: express.Request, res: express.Response) => {
		const text = req.params.text;
		const dialogID = req.params.dialog;

		MessageModel.find(
			{
				$and: [
					{ text: { $regex: text, $options: 'i' } },
					{ dialog: dialogID },
				],
			},
			(err: Error, messages: IMessage[]) => {
				if (err) {
					return res.json(err);
				}
				return res.json({
					messages,
				});
			},
		);
	};
	create = (req: express.Request, res: express.Response) => {
		const { text, dialogID } = req.body;
		const userId = req.user._id;

		const message = new MessageModel({
			text,
			user: userId,
			dialog: dialogID,
		});

		this.updateReadStatus(res, userId, dialogID);

		message
			.save()
			.then((message: any) => {
				message.populate(
					['dialog', 'user'],
					(err: any, message: any) => {
						if (err) {
							return res.status(500).json({
								message: err,
							});
						}
						DialogModel.findByIdAndUpdate(
							message.dialog._id,
							{
								lastMessage: message._id,
							},
							(err, dialog) => {
								res.json(message);
								this.io.emit('SERVER:NEW_MESSAGE', {
									message,
									dialog,
								});
							},
						);
					},
				);
			})
			.catch(err => {
				return res.json({
					err,
				});
			});
	};

	delete = (req: express.Request, res: express.Response) => {
		const _id = req.params.id;
		MessageModel.findByIdAndRemove(
			_id,
			async (err: Error, message: IMessage) => {
				if (err) {
					return res.status(404).json({
						message: `Message not found`,
					});
				}
				const lastMsg: any = await MessageModel.find({
					dialog: message.dialog,
				})
					.populate(['dialog', 'user'])
					.limit(1)
					.sort({ $natural: -1 });

				console.log(lastMsg);

				if (lastMsg.length <= 0) {
					DialogModel.findByIdAndUpdate(
						message.dialog,
						{ $unset: { lastMessage: 1 } },
						(err: Error, dialog) => {
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
						},
					);
				} else {
					DialogModel.findByIdAndUpdate(
						message.dialog,
						{ lastMessage: lastMsg[0]._id },
						(err: Error, dialog) => {
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
						},
					);
				}
			},
		);
	};

	clearChatMessages = (req: express.Request, res: express.Response) => {
		const dialogID = req.params.id;
		MessageModel.deleteMany(
			{ dialog: dialogID },
			(err: Error, deletedMessages: IMessage[]) => {
				if (err) {
					return res.status(404).json({
						message: 'messages with current dialogId not found',
					});
				}
				this.io.emit('SERVER:DELETE_ALL_MESSAGES', deletedMessages);
			},
		);
	};

	updateMessage = (req: express.Request, res: express.Response) => {
		const { text, id } = req.body;

		MessageModel.findByIdAndUpdate(
			id,
			{ text: text, updated: true },
			(err: Error, updatedMessage: IMessage) => {
				if (err) {
					return res.status(404).json({
						message: 'messages not found',
					});
				}

				MessageModel.find({ _id: updatedMessage._id })
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
			},
		);
	};
}

export default MessageController;
