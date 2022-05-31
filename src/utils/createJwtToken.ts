import jwt from 'jsonwebtoken';
import { reduce } from 'lodash';

interface IUserAuthData {
	password: string;
	email: string;
}

export default (user: IUserAuthData) => {
	const data = reduce(
		user,
		(result: any, value: string, key: string) => {
			if (key !== 'password') {
				result[key] = value;
			}
			return result;
		},
		{},
	);
	console.log(data);

	let token = jwt.sign(
		{
			data,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '2 days',
		},
	);

	return token;
};
