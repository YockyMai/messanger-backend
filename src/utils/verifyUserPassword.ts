import bcrypt from 'bcrypt';

export default (reqPassword: string, userPassword: string) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(reqPassword, userPassword).then(function (result) {
			if (!result) {
				reject();
			}

			resolve(result);
		});
	});
};
