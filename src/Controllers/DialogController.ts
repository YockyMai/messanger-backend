import express from 'express';
import { DialogModel, UserModel } from '../Models';

class DialogController {
	index(req: express.Request, res: express.Response) {
		const authorId = req.params.id;
		DialogModel.find({ author: authorId })
			.populate(['author', 'partner'])
			.exec((err, dialogs) => {
				if (err) {
					return res.status(404).json({ message: err });
				}
				return res.json(dialogs);
			});
	}
	async create(req: express.Request, res: express.Response) {
		const { author, partner } = req.body;

		const Dialog = new DialogModel({ author, partner });

		const existAuthor = await UserModel.findById(author);
		const existPartner = await UserModel.findById(partner);

		if (existAuthor && existPartner) {
			Dialog.save()
				.then(dialog => {
					console.log(dialog);
					return res.status(200).json({
						message: 'Dialog created',
					});
				})
				.catch(err => {
					console.log(err);
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
