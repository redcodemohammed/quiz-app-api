import './paths';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';
import { createServer } from 'http';
import { ValidationError } from 'express-json-validator-middleware';

import users_app from './users-app';
import quizzes_app from './quizzes-app';
import { connect } from 'mongoose';

const express_app = express();
const server = createServer(express_app);

const { PORT, DATABASE_URL, DEV, JWT_KEY } = process.env;

if (!PORT) {
	console.error('PORT enviroment var must be provided');
	process.exit();
} else if (!DATABASE_URL) {
	console.error('DATABASE_URL enviroment var must be provided');
	process.exit();
}
else if (!JWT_KEY) {
	console.error('JWT_KEY enviroment var must be provided');
	process.exit();
}

express_app.use(morgan('dev'), cors(), helmet(), express.json());

const apps = [users_app, quizzes_app];
apps.forEach(app => {
	express_app.use(app.route, app.router);
});

// validation error handler
express_app.use((error, request, response, next) => {
	const is_validation_error = error instanceof ValidationError;
	if (is_validation_error) {
		response.status(400).json({
			error: true,
			messages: error.validationErrors,
		});
	} else {
		next();
	}
});

// 404 error handler
express_app.use((req, res) => {
	res.status(404).json({
		error: true,
		messages: ['not found']
	});
});

server.listen(PORT, async () => {
	try {
		await connect(DATABASE_URL);
		console.log('🪣 connected to database');
		console.log('🚀 server started at \x1b[34m%s\x1b[0m', `${DEV ? 'http://localhost:' : 'PORT '}${PORT}`);
	}
	catch (err) {
		console.log('❌ database connection error');
		console.log(err);
		process.exit();
	}
});
