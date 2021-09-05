import { Document } from 'mongoose';

export interface IAnswer extends Document {
	id: string;
	quiz_id: string;
	value: string;
}
