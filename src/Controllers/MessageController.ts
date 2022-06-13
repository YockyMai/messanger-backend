import { IMessage } from './../Models/Message';
import express from 'express';
import { MessageModel, UserModel } from '../Models';
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
	index = (req: express.Request, res: express.Response) => {
		const dialogID: string = req.params.id;
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
						res.json(message);
						this.io.emit('SERVER:NEW_MESSAGE', message);
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
		MessageModel.findByIdAndRemove(_id, (err: Error, message: IMessage) => {
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
}

export default MessageController;
