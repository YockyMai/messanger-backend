import express from 'express';
import { UserModel } from '../Models';

class UserController {
	async index(req: express.Request, res: express.Response) {
		const id = req.params.id;
		UserModel.findById(id, (err, user) => {
			if (err)
				return res.status(404).json({
					message: 'User not found',
				});
			res.send(user);
		});
	}
	create(req: express.Request, res: express.Response) {
		const userData = {
			email: req.body.email,
			password: req.body.password,
			fullname: req.body.fullname,
		};
		const user = new UserModel(userData);
		user.save()
			.then(user => {
				console.log('saved');
				return res.send({
					auth: true,
					user,
				});
			})
			.catch((err: {}) => {
				return res.send({
					auth: false,
					err,
				});
			});
	}

	delete(req: express.Request, res: express.Response) {
		const _id = req.params.id;
		UserModel.findByIdAndRemove(_id, (err: Error, doc: Document) => {
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

export default UserController;
