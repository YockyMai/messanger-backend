import jwt from 'jsonwebtoken';
import { IUser } from '../Models/User';
import { reduce } from 'lodash';

export default (user: IUser) => {
	let token = jwt.sign(
		{
			data: reduce(
				user,
				(result, value: string, key) => {
					if (key !== 'password') {
						(result[value] || (result[value] = [])).push(key);
					}
					return result;
				},
				{},
			),
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_MAX_AGE,
		},
	);
};
