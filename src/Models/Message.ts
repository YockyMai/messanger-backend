import mongoose, { Schema } from 'mongoose';

interface IMessage extends Document {
	author: string;
	partner: string;
	text: string;
	dialog: string;
	unreaded: boolean;
}

const MessageSchema = new Schema<IMessage>(
	{
		author: String,
		partner: String,
		text: String,
		dialog: String,
		unreaded: Boolean,
	},
	{ timestamps: true },
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
