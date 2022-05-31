import bcrypt from 'bcrypt';

const saltRounds = 10;

export bcrypt.genSalt(saltRounds, function (err, salt) {
	bcrypt.hash(process.env.BCRYPT_HASH, salt, function (err, hash) {
		// Store hash in your password DB.
	});
});
