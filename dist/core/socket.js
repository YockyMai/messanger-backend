"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (io) => {
    io.on('connection', socket => {
        console.log('a user connected');
        socket.emit('NEW:MESSAGE', `123`);
    });
    io.on('SERVER:NEW_MESSAGE', socket => { });
    return io;
};
//# sourceMappingURL=socket.js.map