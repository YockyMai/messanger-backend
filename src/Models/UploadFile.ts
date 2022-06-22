import mongoose, { Schema } from 'mongoose';
import { IMessage } from './Message';
import { IUser } from './User';

export interface IUploadFile {
	filename: string;
	size: number;
	ext: string;
	url: string;
	message: IMessage | string;
	user: IUser | string;
}

export type IUploadFileDocument = Document & IUploadFile;

const UploadFileSchema = new Schema(
	{
		filename: String,
		size: Number,
		ext: String,
		url: String,
		message: { type: Schema.Types.ObjectId, ref: 'Message', require: true },
		user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
	},
	{
		timestamps: true,
	},
);

const UploadFileModel = mongoose.model<IUploadFileDocument>(
	'UploadFile',
	UploadFileSchema,
);

export default UploadFileModel;
