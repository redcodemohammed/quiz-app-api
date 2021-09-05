import 'module-alias/register';
import { addAliases } from 'module-alias';

addAliases({
	'@users-app': `${__dirname}/users-app`,
	'@quizzes-app': `${__dirname}/quizzes-app`,
	'@answers-app': `${__dirname}/answers-app`,
	'@middlewares': `${__dirname}/middlewares`,
});
