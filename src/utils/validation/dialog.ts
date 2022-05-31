import validator from 'validator';

export class dialogValidator {
	createDialog(author: string, partner: string, text: string) {
		if (
			validator.isEmpty(author) ||
			validator.isEmpty(partner) ||
			validator.isEmpty(text)
		) {
			return false;
		} else {
			return true;
		}
	}
}
