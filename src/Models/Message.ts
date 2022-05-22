import mongoose, { Schema } from 'mongoose';

export interface IMessage extends Document {
	text: string;
	dialog: string;
	user: string;
	unread: {
		type: Boolean;
		default: boolean;
	};
}

const MessageSchema = new Schema<IMessage>(
	{
		text: String,
		dialog: { type: Schema.Types.ObjectId, ref: 'Dialog', required: true },
		user: { type: String, ref: 'User', required: true },
		unread: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
