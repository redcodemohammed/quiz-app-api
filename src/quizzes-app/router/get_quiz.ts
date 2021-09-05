import { quiz_model } from '@quizzes-app/model';
import { user_model } from '@users-app/model';
import { Router } from 'express';
import { AllowedSchema, Validator } from 'express-json-validator-middleware';

export const get_quiz = Router();

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

get_quiz.get('/:uuid', validate({ params: uuid_schema }), async (req, res) => {
	try {
		const uuid = req.params.uuid;
		// find the quiz
		const quiz = await quiz_model.findOne({ id: uuid });
		if (quiz == null) {
			res.status(404).json({
				error: true,
				message: 'quiz was not found',
				data: null
			}).end();
		}
		else {
			// find the user
			const user = await user_model.findOne({ id: quiz.user_id });

			// return response
			res.status(200).json({
				error: false,
				message: 'quiz was found',
				data: {
					quiz: {
						title: quiz.title,
						description: quiz.description,
						questions: quiz.questions,
						published_date: quiz.published_date
					},
					user: {
						name: user.name
					}
				}
			});
		}
	} catch {
		res.status(500).json({
			error: true,
			message: 'an unknown error happened please try again later',
			data: null
		}).end();
	}
});
