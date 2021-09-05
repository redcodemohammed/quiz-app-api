import { Router } from 'express';
import { verify } from 'jsonwebtoken';

const { JWT_KEY } = process.env;


const authentication = Router();

authentication.use(async (req, res, next) => {
	const auth_header = req.headers.authorization;
	//@ts-ignore
	if (!auth_header) {
		return res.status(403).json({
			error: true,
			message: 'not authenticated',
			data: null
		}).end();
	}
	else {
		const token = auth_header.split(' ')[1];
		try {
			const jwt_data = await verify(token, JWT_KEY);
			//@ts-ignore
			req.user = { name: jwt_data.name, uuid: jwt_data.uuid };
		} catch {
			return res.status(403).json({
				error: true,
				message: 'not authenticated',
				data: null
			}).end();
		}
	}
	next();
});

export default authentication;
