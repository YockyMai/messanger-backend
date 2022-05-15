import mongoose from 'mongoose';
import express from 'express';
import { UserModel } from './Schemas/';
import bodyParser from 'body-parser';
import { UserController } from './Controllers';
require('dotenv').config();

const app = express();
const User = new UserController();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/user/:id', User.index);

app.post('/user/registration', User.create);

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
