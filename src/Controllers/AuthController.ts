import { IUser } from './../Models/User';
import express from 'express';
import { UserModel } from '../Models';
import createJwtToken from '../utils/createJwtToken';
import verifyJwtToken from '../utils/verifyJwtToken';
import bcrypt from 'bcrypt';
import { LoginValidator } from '../utils/validation/login';

class AuthController {
	getMe(req: express.Request, res: express.Response) {
		const token = req.headers.token;

		verifyJwtToken(token as string).then(decodedToken => {
			return decodedToken;
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
			if (err) {
				return res.status(404).json({
					message: 'User not found',
				});
			}

			bcrypt.compare(password, user.password).then(function (result) {
				if (!result) {
					return res.json({
						status: 'error',
						message: 'Incorrect password or email',
					});
				}

				const token = createJwtToken(userData);
				return res.json({
					message: 'success',
					token,
				});
			});
		});
	}
}

export default AuthController;
