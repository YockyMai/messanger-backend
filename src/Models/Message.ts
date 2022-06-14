import mongoose, { Schema } from 'mongoose';

export interface IMessage extends Document {
	_id: string;
	text: string;
	dialog: string;
	user: string;
	unread: {
		type: Boolean;
		default: boolean;
	};
	updated: {
		type: Boolean;
		default: false;
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
		updated: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
