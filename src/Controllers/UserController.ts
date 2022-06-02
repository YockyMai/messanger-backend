import { IUser } from './../Models/User';
import express from 'express';
import { UserModel } from '../Models';
import createJwtToken from '../utils/createJwtToken';
import { LoginValidator } from '../utils/validation/login';

class UserController {
	async index(req: express.Request, res: express.Response) {
		const id = req.params.id;
		UserModel.findById(id, (err: Error, user: IUser) => {
			if (err)
				return res.status(404).json({
					message: 'User not found',
				});
			res.send(user);
		});
	}

	async getMe(req: express.Request, res: express.Response) {
		const id = req.user._id;
		UserModel.findById(id, (err: Error, user: IUser) => {
			if (err)
				return res.status(404).json({
					message: 'User not found',
				});
			res.send(user);
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
