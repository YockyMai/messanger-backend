import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: 'dlckalbpc',
	api_key: '996886674394998',
	api_secret: '2HtWeKommVTdBW1u9g6WuG37bjE',
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: async (req, file) => {
		return {
			folder: 'image',
		};
	},
});

export const uploader = multer({ storage: storage });

export default cloudinary;
