import mongoose from 'mongoose';
import express from 'express';
import { UserModel } from './Models';
import bodyParser from 'body-parser';
import {
	UserController,
	DialogController,
	MessageController,
} from './Controllers';
require('dotenv').config();

const app = express();
const User = new UserController();
const Dialog = new DialogController();
const Message = new MessageController();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/user/:id', User.index);
app.post('/user/registration', User.create);
app.delete('/user/:id', User.delete);

app.get('/dialog/:id', Dialog.index);
app.post('/dialog', Dialog.create);

app.get('/message/:id', Message.index);
app.post('/message', Message.create);
app.delete('/message/:id', Message.delete);

const start = async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://ValeriyGrigorev:${process.env.DB_PASSWORD}@notes.meb4q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
		);
		app.listen(PORT, () => {
			console.log(`Server runned on ${PORT} port`);
		});
	} catch (e) {
		console.log(e);
	}
};

start();
