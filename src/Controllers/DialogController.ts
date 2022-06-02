import { IDialog } from './../Models/Dialogs';
import express from 'express';
import { DialogModel, MessageModel, UserModel } from '../Models';

declare module 'express' {
	export interface Request {
		user?: any;
	}
}

class DialogController {
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
	async create(req: express.Request, res: express.Response) {
		const { author, partner, text } = req.body;

		const existAuthor = await UserModel.findById(author);
		const existPartner = await UserModel.findById(partner);

		const Dialog = new DialogModel({ author, partner });

		if (existAuthor && existPartner) {
			Dialog.save()
				.then(dialog => {
					const Message = new MessageModel({
						text,
						dialog: dialog._id,
						user: author,
					});
					Message.save().then(messageObj => {
						return res.json({
							messageObj,
							dialog,
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
	}
}

export default DialogController;
