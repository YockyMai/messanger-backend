import bcrypt from 'bcrypt';

export default (password: string) => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt((err, salt) => {
			if (err) reject(err);

			bcrypt.hash(password, salt, (err, hash: string) => {
				if (err) reject(err);

				resolve(hash);
			});
		});
	});
};
