import { Router } from 'express';
import { add_quiz } from '@quizzes-app/router/add_quiz';
import { get_quiz } from '@quizzes-app/router/get_quiz';
import { remove_quiz } from './remove_quiz';

const router = Router();

router
	.use('/', add_quiz)
	.use('/', get_quiz)
	.use('/', remove_quiz);

export default router;
