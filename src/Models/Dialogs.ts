import mongoose, { Model, Schema } from 'mongoose';

export interface IDialog extends Document {
	author: {
		type: Schema.Types.ObjectId;
		ref: string;
		required: boolean;
	};
	partner: {
		type: Schema.Types.ObjectId;
		ref: string;
		required: boolean;
	};
	lastMessage: {
		type: Schema.Types.ObjectId;
		ref: string;
	};
}

const DialogSchema = new Schema<IDialog>(
	{
		author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // relationshpis
		partner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
	},
	{ timestamps: true },
);

const DialogModel = mongoose.model('Dialog', DialogSchema);

export default DialogModel;
