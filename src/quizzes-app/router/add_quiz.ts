import authentication from '@middlewares/authentication';
import { quiz_model } from '@quizzes-app/model';
import { Router } from 'express';
import { AllowedSchema, Validator } from 'express-json-validator-middleware';
import { v4 as uuidv4 } from 'uuid';

export const add_quiz = Router();

const { validate } = new Validator({});
const quiz_schema: AllowedSchema = {
	type: 'object',
	required: ['title', 'description', 'questions'],
	properties: {
		title: {
			type: 'string',

		},
		description: {
			type: 'string',

		},
		questions: {
			type: 'array',
			items: {
				type: 'object',
				required: ['title', 'type', 'right_answer', 'answers'],
				properties: {
					title: {
						type: 'string',
					},
					type: {
						type: 'string',
						pattern: '^(WH-QUESTION|YES-NO-QUESTION|MULTICHOICE-QUESTION)$'
					},
					answers: {
						type: 'array',
						items: {
							type: 'string'
						}
					},
					right_answer: {
						type: 'string'
					}
				}
			}
		}
	}
};

add_quiz.post('/', authentication, validate({ body: quiz_schema }), async (req, res) => {
	const { title, description, questions } = req.body;
	//@ts-ignore
	const user_uuid = req.user.uuid;

	// generate a uuid
	const uuid = uuidv4();

	try {
		// store the new quiz
		await quiz_model.create({
			id: uuid,
			title,
			description,
			questions,
			user_id: user_uuid,
		});

		res.status(201).json({
			error: false,
			message: 'quiz was added successfully',
			data: {
				quiz: {
					id: uuid,
					title,
					description,
					questions,
					//@ts-ignore
					user: req.user
				}
			}
		}).end();
	} catch {
		res.status(500).json({
			error: true,
			message: 'an unknown error happened please try again later',
			data: null
		}).end();
	}
});
