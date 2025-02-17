import { QuizDocument } from "@/data/types/mongoose-document-types";
import mongoose, {Model, Schema, model} from "mongoose";

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
},{collection: 'quiz-list'})
const HartsQuiz: Model<QuizDocument> = mongoose.models?.HartsQuiz || model('HartsQuiz',quizSchema);
export default HartsQuiz