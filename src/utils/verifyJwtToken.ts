import jwt from 'jsonwebtoken';

export default (token: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
			if (err || !decodedToken) {
				console.log(err);
				return;
			}
			return resolve(decodedToken);
		});
	});
};
