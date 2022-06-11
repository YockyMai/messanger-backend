import { IDialog } from './../Models/Dialogs';
import express from 'express';
import { DialogModel, MessageModel, UserModel } from '../Models';
import socket from 'socket.io';

class DialogController {
	io: socket.Server; //inner types

	constructor(io: socket.Server) {
		this.io = io;
	}

	index(req: express.Request, res: express.Response) {
		// const { user } = req.body.user;
		const userID = req.user._id;

		DialogModel.find({ $or: [{ author: userID }, { partner: userID }] })
			.populate(['author', 'partner'])
			.exec((err, dialogs) => {
				if (err) {
					return res.status(404).json({ message: err });
				}
				return res.json(dialogs);
			});
	}
	create = async (req: express.Request, res: express.Response) => {
		const { partner, text } = req.body;
		const author = req.user._id;

		const existAuthor = await UserModel.findById(author);
		const existPartner = await UserModel.findById(partner);

		const Dialog = new DialogModel({ author, partner });

		if (existAuthor && existPartner) {
			Dialog.save()
				.then(dialog => {
					DialogModel.findById(dialog._id)
						.populate(['author', 'partner'])
						.exec((err, dialogs) => {
							if (err) {
								return res.status(404).json({ message: err });
							}

							const Message = new MessageModel({
								text,
								dialog: dialog._id,
								user: author,
							});
							Message.save().then(messageObj => {
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
				})
				.catch(err => {
					return res.status(400).json({
						err,
					});
				});
		} else {
			return res.status(404).json({
				message: 'Users not found',
			});
		}
	};
}

export default DialogController;
