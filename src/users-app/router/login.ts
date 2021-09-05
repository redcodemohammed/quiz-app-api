import { compareSync } from 'bcrypt';
import { Router } from 'express';
import { Validator, AllowedSchema } from 'express-json-validator-middleware';
import { sign } from 'jsonwebtoken';
import { user_model } from '@users-app/model';

const { JWT_KEY } = process.env;

export const login = Router();

const { validate } = new Validator({});
const user_schema: AllowedSchema = {
	type: 'object',
	required: ['email', 'password'],
	properties: {
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


login
	.post('/', validate({ body: user_schema }), async (req, res) => {
		const { email, password } = req.body;
		try {
			// check if the email is correct or not
			const user = await user_model.findOne({ email });

			if (user === null) return res.status(401).json({
				error: true,
				message: 'the email or password is incorrect',
				data: null
			}).end();

			// compare the passwords
			const is_valid_password = compareSync(password, user.password);
			if (!is_valid_password) return res.status(401).json({
				error: true,
				message: 'the email or password is incorrect',
				data: null
			}).end();

			// generate a jwt
			const jwt_data = {
				uuid: user.id,
				name: user.name
			};
			const jwt = sign(jwt_data, JWT_KEY, { expiresIn: '2 days' });

			// return response
			res.status(201).json({
				error: false,
				message: 'logged in successfully',
				data: {
					user: user.name,
					token: jwt,
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

export default login;
