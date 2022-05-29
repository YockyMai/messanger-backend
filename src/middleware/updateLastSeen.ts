import { UserModel } from '../Models';
import express from 'express';

export default (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) => {
	UserModel.updateOne(
		{ _id: '628905ae0d62a56dd309ad71' },
		{ $set: { last_seen: new Date() } },
	)
		.then(() => {
			console.log(123);
		})
		.catch(err => {
			console.log(err);
		});

	next();
};
