import { IMessage } from './../Models/Message';
import express from 'express';
import { MessageModel, UserModel } from '../Models';

class MessageController {
	async index(req: express.Request, res: express.Response) {
		const dialogID: string = req.params.id;
		MessageModel.find({ dialog: dialogID })
			.populate('dialog')
			.exec((err, message) => {
				if (err)
					return res.status(404).json({
						err,
					});
				return res.json(message);
			});
	}
	findByText(req: express.Request, res: express.Response) {
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
	}
	create(req: express.Request, res: express.Response) {
		const { text, dialogID, user } = req.body;

		const message = new MessageModel({
			text,
			user,
			dialog: dialogID,
		});
		message
			.save()
			.then((message: IMessage) => {
				return res.json({
					message,
				});
			})
			.catch(err => {
				return res.json({
					err,
				});
			});
	}

	delete(req: express.Request, res: express.Response) {
		const _id = req.params.id;
		MessageModel.findByIdAndRemove(_id, (err: Error, message: IMessage) => {
			if (err) {
				return res.status(404).json({
					message: `Message ${message.text} not found`,
				});
			}
			return res.json({
				message: `Message "${message.text}" deleted successfully`,
			});
		});
	}
}

export default MessageController;
