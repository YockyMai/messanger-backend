import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';
import generatePasswordHash from '../utils/generatePasswordHash';

export interface IUser extends Document {
	email: string;
	fullname: string;
	password: string;
	confirmed?: boolean;
	avatar?: string;
	confirm_hash?: string;
	last_seen?: Date;
}

const UserSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			validate: [isEmail, 'invalid email'],
			unique: true,
		},
		fullname: {
			type: String,
			required: true,
		},

		password: {
			type: String,
			required: true,
		},
		confirmed: {
			type: Boolean,
			default: false,
		},
		avatar: String,
		confirm_hash: String,
		last_seen: {
			type: Date,
			default: new Date(),
		},
	},
	{
		timestamps: true, // added 2 properties - updatedAt, createdAt
	},
);

UserSchema.pre('save', function (next) {
	var user = this;

	generatePasswordHash(user.password)
		.then(hash => {
			user.password = hash as string;
			next();
		})
		.catch(err => {
			next(err);
		});

	bcrypt.genSalt((err, salt) => {
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) {
				return next(err);
			}

			user.password = hash;
			next();
		});
	});
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
