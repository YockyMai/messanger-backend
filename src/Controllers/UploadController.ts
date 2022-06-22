import express from 'express';

import cloudinary from '../core/cloudinary';
import { UserModel } from '../Models';
import UploadFile from '../Models/UploadFile';
import { IUploadFile, IUploadFileDocument } from '../models/UploadFile';

class UserController {
	create = (req: express.Request, res: express.Response) => {
		const qwe = JSON.stringify(req.file);
		const qwerty = JSON.parse(qwe);
		console.log(qwerty);
	};

	createAvatarPhoto = (req: express.Request, res: express.Response) => {
		const userId = req.user._id;
		const file = req.file;

		UserModel.findByIdAndUpdate(
			userId,
			{ avatar: file.path },
			(err, doc) => {
				if (err) {
					return res.json({
						message: err,
						status: 'error',
					});
				}

				console.log(doc);

				return res.json({
					path: file.path,
				});
			},
		);
	};

	delete() {}
}

export default UserController;
