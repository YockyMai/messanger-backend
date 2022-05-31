import validator from 'validator';

export class LoginValidator {
	password(password: string) {
		if (
			validator.isStrongPassword(password, {
				minLength: 8,
				minUppercase: 1,
			})
		) {
			return true;
		}
		return false;
	}
	email(email: string) {
		if (validator.isEmail(email)) {
			return true;
		}
		return false;
	}
}
