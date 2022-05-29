import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

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

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
