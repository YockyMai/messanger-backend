import mongoose from 'mongoose';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import routes from './core/Routes';
require('dotenv').config();

//SERVER
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
	},
});
const PORT = process.env.PORT || 3000;

routes(app);

//SOCKET ROUTES
let users = 0;

io.on('connection', socket => {
	console.log('a user connected');
	++users;
	socket.emit('test-command', `${users}`);
});

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
