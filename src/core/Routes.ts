import { UserCtrl, AuthCtrl, DialogCtrl, MessageCtrl } from '../Controllers/';
import bodyParser from 'body-parser';
import updateLastSeen from '../middleware/updateLastSeen';
import checkAuth from '../middleware/checkAuth';
import express from 'express';
import socket from 'socket.io';
import cors from 'cors';

export default (app: express.Express, io: socket.Server) => {
	const UserController = new UserCtrl(io);
	const MessageController = new MessageCtrl(io);
	const DialogController = new DialogCtrl(io);
	const AuthController = new AuthCtrl(io);

	//MIDDELWARE
	app.use(cors({ origin: '*' }));
	app.use(updateLastSeen);
	app.use(checkAuth);
	app.use(bodyParser.json());
	//HTTP ROUTES
	app.get('/user/me/', UserController.getMe);
	app.get('/user/:id', UserController.index);
	app.delete('/user/:id', UserController.delete);

	app.post('/user/login', AuthController.login);
	app.post('/user/registration', AuthController.create);

	app.get('/dialog', DialogController.index);
	app.post('/dialog', DialogController.create);

	app.get('/message/:id', MessageController.index);
	app.post('/message', MessageController.create);
	app.delete('/message/:id', MessageController.delete);
	app.delete('/messageAll/:id', MessageController.clearChatMessages);
	app.post('/messageupdate', MessageController.updateMessage);

	app.get('/find/message/:dialog/:text', MessageController.findByText);
	app.get('/find/user/:username/:limit', UserController.getUsersByName);
};
