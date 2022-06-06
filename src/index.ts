import mongoose from 'mongoose';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import routes from './core/Routes';
import socket from './core/socket';
require('dotenv').config();

//SERVER
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

socket(io);
routes(app, io);

const start = async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://ValeriyGrigorev:${process.env.DB_PASSWORD}@notes.meb4q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
		);
		// app.listen(PORT, () => {
		// 	console.log(`Server runned on ${PORT} port`);
		// });
		server.listen(PORT, () => {
			console.log(`Listening socket server on ${PORT}`);
		});
	} catch (e) {
		console.log(e);
	}
};

start();
