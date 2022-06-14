"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controllers_1 = require("../Controllers/");
const body_parser_1 = __importDefault(require("body-parser"));
const updateLastSeen_1 = __importDefault(require("../middleware/updateLastSeen"));
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const cors_1 = __importDefault(require("cors"));
exports.default = (app, io) => {
    const UserController = new Controllers_1.UserCtrl(io);
    const MessageController = new Controllers_1.MessageCtrl(io);
    const DialogController = new Controllers_1.DialogCtrl(io);
    const AuthController = new Controllers_1.AuthCtrl(io);
    //MIDDELWARE
    app.use((0, cors_1.default)({ origin: '*' }));
    app.use(updateLastSeen_1.default);
    app.use(checkAuth_1.default);
    app.use(body_parser_1.default.json());
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
//# sourceMappingURL=Routes.js.map