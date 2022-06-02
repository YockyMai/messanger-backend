import validator from 'validator';

export class LoginValidator {
	password(password: string) {
		if (
			validator.isStrongPassword(password, {
				minSymbols: 0,
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
	fullname(fullname: string) {
		if (fullname.length > 6) return true;
		else return false;
	}
}
