import express from 'express';
import { UserModel } from '../Schemas';

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
			.then(() => {
				console.log('saved');
				return res.send({
					auth: true,
				});
			})
			.catch((err: {}) => {
				return res.send({
					auth: false,
					err,
				});
			});
	}
}

export default UserController;
