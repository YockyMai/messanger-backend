import { IUser } from './../Models/User';
import express from 'express';
import { UserModel } from '../Models';
import createJwtToken from '../utils/createJwtToken';
import verifyJwtToken from '../utils/verifyJwtToken';
import bcrypt from 'bcrypt';
import { LoginValidator } from '../utils/validation/login';
import generatePasswordHash from '../utils/generatePasswordHash';
import verifyUserPassword from '../utils/verifyUserPassword';
import socket from 'socket.io';
class AuthController {
	io: socket.Server; //inner types

	constructor(io: socket.Server) {
		this.io = io;
	}

	getMe(req: express.Request, res: express.Response) {
		const token = req.user._id;

		console.log(token);

		verifyJwtToken(token as string)
			.then(decodedToken => {
				return res.json({
					decodedToken,
				});
			})
			.catch(() => {});
	}

	create(req: express.Request, res: express.Response) {
		const loginValidator = new LoginValidator();

		const userData = {
			email: req.body.email,
			password: req.body.password,
			fullname: req.body.fullname,
		};
		const user = new UserModel(userData);

		if (
			!loginValidator.email(userData.email) ||
			!loginValidator.password(userData.password) ||
			!loginValidator.fullname(userData.fullname)
		)
			return res.status(400).json({
				message: 'Validation failed',
			});

		user.save()
			.then(user => {
				return res.json({
					auth: true,
					user,
				});
			})
			.catch((err: {}) => {
				return res.json({
					auth: false,
					err,
				});
			});
	}

	login(req: express.Request, res: express.Response) {
		const loginValidator = new LoginValidator();

		const { email, password } = req.body;

		const userData = {
			email,
			password,
		};

		if (
			!loginValidator.email(userData.email) ||
			!loginValidator.password(userData.password)
		) {
			return res.status(400).json({
				message: 'Validation failed',
			});
		}

		UserModel.findOne({ email: email }, (err: Error, user: IUser) => {
			if (err || !user) {
				return res.json({
					message: 'User not found',
				});
			}

			verifyUserPassword(password, user.password)
				.then(() => {
					const token = createJwtToken(user);

					verifyJwtToken(token).then(userData => {
						const user = userData.data._doc;
						return res.json({
							message: 'success',
							token,
							user,
						});
					});
				})
				.catch(() => {
					return res.json({
						status: 'error',
						message: 'Incorrect password or email',
					});
				});
		});
	}
}

export default AuthController;
