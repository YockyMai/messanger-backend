import { IUser } from './../Models/User';
import express from 'express';
import { UserModel } from '../Models';
import createJwtToken from '../utils/createJwtToken';
import { LoginValidator } from '../utils/validation/login';
import socket from 'socket.io';

class UserController {
	io: socket.Server; //inner types

	constructor(io: socket.Server) {
		this.io = io;
	}

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

	async getUsersByName(req: express.Request, res: express.Response) {
		const username = req.params.username;
		const limit = req.params.limit;
		UserModel.find({
			$and: [{ fullname: { $regex: username, $options: 'i' } }],
		})
			.limit(Number(limit))
			.exec((err: Error, users: IUser[]) => {
				if (err)
					return res.status(404).json({
						message: 'Users not found',
					});
				return res.json(users);
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
			return res.status(200).json({
				message: 'User deleted successfully',
			});
		});
	}
}

export default UserController;
