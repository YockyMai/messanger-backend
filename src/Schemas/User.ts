import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

const UserSchema = new Schema(
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
		last_seen: Date,
	},
	{
		timestamps: true, // added 2 properties - updatedAt, createdAt
	},
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
