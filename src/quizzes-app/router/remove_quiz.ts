import authentication from '@middlewares/authentication';
import { quiz_model } from '@quizzes-app/model';
import { Router } from 'express';
import { AllowedSchema, Validator } from 'express-json-validator-middleware';

export const remove_quiz = Router();

const { validate } = new Validator({});
const uuid_schema: AllowedSchema = {
	type: 'object',
	required: ['uuid'],
	properties: {
		uuid: {
			type: 'string'
		}
	}
};

remove_quiz.delete('/:uuid', authentication, validate({ params: uuid_schema }), async (req, res) => {
	try {
		const uuid = req.params.uuid;

		// find the quiz
		const quiz = await quiz_model.findOne({ id: uuid });
		if (quiz == null) return res.status(404).json({
			error: true,
			message: 'quiz was not found',
			data: null
		}).end();

		// make sure the the current user owns the quix
		//@ts-ignore
		if (quiz.user_id !== req.user.uuid) return res.status(403).json({
			error: true,
			message: 'user doesn\'t own this quiz',
			data: null
		}).end();


		// remove the quiz
		await quiz_model.findOneAndRemove({ id: uuid });
		// todo: remove all answers for this quiz

		return res.status(204).end();
	} catch {
		res.status(500).json({
			error: true,
			message: 'an unknown error happened please try again later',
			data: null
		}).end();
	}
});
