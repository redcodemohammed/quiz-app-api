import { Router } from 'express';
import login from '@users-app/router/login';
import register from '@users-app/router/register';

const router = Router();

router
	.use('/register', register)
	.use('/login', login);

export default router;
