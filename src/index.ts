import mongoose from 'mongoose';
import express from 'express';
import { UserModel } from './Models';
import bodyParser from 'body-parser';
import {
	UserController,
	DialogController,
	MessageController,
} from './Controllers';
import updateLastSeen from './middleware/updateLastSeen';
import checkAuth from './middleware/checkAuth';
import AuthController from './Controllers/AuthController';
require('dotenv').config();

const app = express();

const User = new UserController();
const Dialog = new DialogController();
const Message = new MessageController();
const Auth = new AuthController();

const PORT = process.env.PORT || 3000;

app.use(updateLastSeen);
app.use(checkAuth);
app.use(bodyParser.json());

app.get('/user/:id', User.index);
app.post('/user/registration', User.create);
app.delete('/user/:id', User.delete);

app.post('/user/login', Auth.login);
app.get('/user/getMe', Auth.getMe);

app.get('/dialog/:id', Dialog.index);
app.post('/dialog', Dialog.create);

app.get('/message/:id', Message.index);
app.post('/message', Message.create);
app.delete('/message/:id', Message.delete);
app.get('/message/find/:dialog/:text', Message.findByText);

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
