import { hashSync } from 'bcrypt';
import { Router } from 'express';
import { Validator, AllowedSchema } from 'express-json-validator-middleware';
import { v4 as uuidv4 } from 'uuid';
import { user_model } from '@users-app/model';

export const register = Router();

const { validate } = new Validator({});
const user_schema: AllowedSchema = {
	type: 'object',
	required: ['name', 'email', 'password'],
	properties: {
		name: {
			type: 'string',
			minLenght: 3,
		},
		email: {
			type: 'string',
			format: 'email',
		},
		password: {
			type: 'string',
			minLength: 6,
		},
	}
};


register
	.post('/', validate({ body: user_schema }), async (req, res) => {
		const { name, email, password } = req.body;
		try {
			// check if the email is in use or not
			const is_used = await user_model.findOne({ email }) !== null;
			if (is_used) return res.status(409).json({
				error: true,
				message: 'this email is already in use',
				data: null
			}).end();

			// hash password:
			const hash = hashSync(password, 10);

			// generate a uuid
			const uuid = uuidv4();

			// store new user:
			await user_model.create({
				id: uuid,
				email,
				name,
				password: hash,
			});

			// return response
			res.status(201).json({
				error: false,
				message: 'a new user has been created sucessfully',
				data: {
					user: {
						id: uuid,
						email,
						name
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

export default register;
