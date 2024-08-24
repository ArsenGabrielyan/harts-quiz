import { Schema, model, models } from "mongoose"

const quizSchema = new Schema({
     id: String,
     name: String,
     teacher: String,
     teacherEmail: String,
     description: String,
     questions: Schema.Types.Mixed,
     visibility: String,
     subject: String
},{collection: 'quiz-list',versionKey: "_quizKey"})
const HartsQuiz = models.HartsQuiz || model('HartsQuiz',quizSchema);
export default HartsQuiz