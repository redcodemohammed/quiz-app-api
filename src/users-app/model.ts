import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
  // account
  id: string;
  name: string;
  email: string;
  password: string;

  // remaining quizes
  remaining_free_quizess: number;
  paid: boolean;
}

export const user_schema = new Schema({
	// account
	id: { type: String, required: true, },
	name: { type: String, required: true, },
	email: { type: String, required: true, },
	password: { type: String, required: true, },

	// remaining quizes
	remaining_free_quizess: { type: Number, default: 5 },
	paid: { type: Boolean, default: false },
});

export const user_model = model<IUser>('user', user_schema);

