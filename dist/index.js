"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const Routes_1 = __importDefault(require("./core/Routes"));
const socket_1 = __importDefault(require("./core/socket"));
require('dotenv').config();
//SERVER
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 3000;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
(0, socket_1.default)(io);
(0, Routes_1.default)(app, io);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(`mongodb+srv://ValeriyGrigorev:${process.env.DB_PASSWORD}@notes.meb4q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
        // app.listen(PORT, () => {
        // 	console.log(`Server runned on ${PORT} port`);
        // });
        server.listen(PORT, () => {
            console.log(`Listening socket server on ${PORT}`);
        });
    }
    catch (e) {
        console.log(e);
    }
});
start();
//# sourceMappingURL=index.js.map