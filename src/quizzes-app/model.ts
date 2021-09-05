import { Document, model, Schema } from 'mongoose';

export interface IQuestion extends Document {
	id: number;
	title: string;
	type: 'WH-QUESTION' |
	'YES-NO-QUESTION' |
	'MULTICHOICE-QUESTION'
	answers: string[];
	right_answer: string;
}

export interface IQuiz {
	id: string;
	title: string;
	description: string;
	user_id: string;
	questions: IQuestion[];
	published_date: Date;
}

export const quiz_schema = new Schema({
	id: { type: String, required: true, },
	title: { type: String, required: true, },
	description: { type: String, required: true, },
	user_id: { type: String, required: true, },
	questions: { type: [], default: [] },

}, {
	timestamps: {
		createdAt: 'published_date',
		updatedAt: false
	}
});

export const quiz_model = model<IQuiz>('quiz', quiz_schema);
