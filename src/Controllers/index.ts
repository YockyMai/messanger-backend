import { default as UserCtrl } from './UserController';
import { default as MessageCtrl } from './MessageController';
import { default as DialogCtrl } from './DialogController';
import { default as AuthCtrl } from './AuthController';

export const UserController = new UserCtrl();
export const MessageController = new MessageCtrl();
export const DialogController = new DialogCtrl();
export const AuthController = new AuthCtrl();
