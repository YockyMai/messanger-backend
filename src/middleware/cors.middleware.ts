import { NextFunction, Response, Request } from 'express';
export default (req: Request, res: Response, next: NextFunction) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Methods',
		'GET, PUT, PATCH, POST, DELETE, OPTIONS',
	);
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	next();
};
