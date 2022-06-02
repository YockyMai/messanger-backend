import {
	UserController,
	AuthController,
	DialogController,
	MessageController,
} from '../Controllers/';
import bodyParser from 'body-parser';
import updateLastSeen from '../middleware/updateLastSeen';
import checkAuth from '../middleware/checkAuth';
import corsMiddleware from '../middleware/cors.middleware';

export default app => {
	//MIDDELWARE
	app.use(corsMiddleware);
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
	app.get('/message/find/:dialog/:text', MessageController.findByText);
};
