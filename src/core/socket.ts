import { Server } from 'socket.io';

export default (io: Server) => {
	io.on('connection', socket => {
		console.log('a user connected');
		socket.emit('NEW:MESSAGE', `123`);
	});

	io.on('SERVER:NEW_MESSAGE', socket => {});

	return io;
};
