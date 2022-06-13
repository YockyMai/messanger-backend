import { UserModel } from '../Models';
import express from 'express';

export default (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) => {
	if (req.user) {
		UserModel.findOneAndUpdate(
			{ _id: req.user.id },
			{
				last_seen: new Date(),
			},
			{ new: true },
		);
	}

	next();
};
