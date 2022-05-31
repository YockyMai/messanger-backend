import express, { Request, Response } from 'express';
import { NextFunction } from 'express';
import { UserModel } from '../Models';
import verifyJwtToken from '../utils/verifyJwtToken';

// interface IGetUserRequest extends Request {
// 	user: any;
// }

export default (req: any, res: Response, next: NextFunction) => {
	const token = req.headers.token;

	if (req.path === '/user/login' || req.path === '/user/registration') {
		return next();
	}

	if (token) {
		verifyJwtToken(token)
			.then(user => {
				req.user = user;
				next();
			})
			.catch(() => {
				res.status(404).json({
					message: 'Invalid auth token',
				});
			});
	}
};
