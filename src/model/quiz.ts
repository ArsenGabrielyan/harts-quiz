import { QuizDocument } from "@/data/types/mongoose-document-types";
import { Model, Schema, model, models } from "mongoose"

const quizSchema = new Schema<QuizDocument>({
     name: String,
     teacher: String,
     teacherEmail: String,
     description: String,
     questions: Schema.Types.Mixed,
     visibility: String,
     subject: String,
     createdAt: {
          type: Date,
          default: new Date()
     }
},{collection: 'quiz-list',versionKey: "_quizKey"})
const HartsQuiz: Model<QuizDocument> = models.HartsQuiz || model('HartsQuiz',quizSchema);
export default HartsQuiz