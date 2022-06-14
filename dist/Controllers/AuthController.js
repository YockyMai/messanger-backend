"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Models_1 = require("../Models");
const createJwtToken_1 = __importDefault(require("../utils/createJwtToken"));
const verifyJwtToken_1 = __importDefault(require("../utils/verifyJwtToken"));
const login_1 = require("../utils/validation/login");
const verifyUserPassword_1 = __importDefault(require("../utils/verifyUserPassword"));
class AuthController {
    constructor(io) {
        this.io = io;
    }
    getMe(req, res) {
        const token = req.user._id;
        (0, verifyJwtToken_1.default)(token)
            .then(decodedToken => {
            return res.json({
                decodedToken,
            });
        })
            .catch(() => { });
    }
    create(req, res) {
        const loginValidator = new login_1.LoginValidator();
        const userData = {
            email: req.body.email,
            password: req.body.password,
            fullname: req.body.fullname,
        };
        const user = new Models_1.UserModel(userData);
        if (!loginValidator.email(userData.email) ||
            !loginValidator.password(userData.password) ||
            !loginValidator.fullname(userData.fullname))
            return res.status(400).json({
                message: 'Validation failed',
            });
        user.save()
            .then(user => {
            return res.json({
                auth: true,
                user,
            });
        })
            .catch((err) => {
            return res.json({
                auth: false,
                err,
            });
        });
    }
    login(req, res) {
        const loginValidator = new login_1.LoginValidator();
        const { email, password } = req.body;
        const userData = {
            email,
            password,
        };
        if (!loginValidator.email(userData.email) ||
            !loginValidator.password(userData.password)) {
            return res.status(400).json({
                message: 'Validation failed',
            });
        }
        Models_1.UserModel.findOne({ email: email }, (err, user) => {
            if (err || !user) {
                return res.json({
                    message: 'User not found',
                });
            }
            (0, verifyUserPassword_1.default)(password, user.password)
                .then(() => {
                const token = (0, createJwtToken_1.default)(user);
                (0, verifyJwtToken_1.default)(token).then(userData => {
                    const user = userData.data._doc;
                    return res.json({
                        message: 'success',
                        token,
                        user,
                    });
                });
            })
                .catch(() => {
                return res.json({
                    status: 'error',
                    message: 'Incorrect password or email',
                });
            });
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map