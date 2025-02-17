import mongoose from "mongoose"
import { AccountType, IQuestion, QuizVisibility, SubjectName } from "./other-types"

interface MongooseDocument{
     _id: string
}
export interface TokenDocument extends MongooseDocument{
     email: string,
     token: string,
     expires: Date
}
export interface UserDocument extends MongooseDocument{
     name: string,
     email: string,
     username: string
     organization: string,
     password: string,
     image: string,
     accountType: AccountType,
     emailVerified: Date,
     isTwoFactorEnabled: boolean,
     soundEffectOn: boolean,
     showFavoriteSubject: boolean,
     isOauth: boolean
     bio: string,
     favoriteSubject: SubjectName,
     favorites: string[]
}
export interface QuizDocument extends MongooseDocument{
     name: string,
     teacher: string,
     teacherEmail: string,
     description: string,
     questions: IQuestion[],
     visibility: QuizVisibility,
     subject: SubjectName,
     createdAt: Date
}
export interface TwoFactorConfirmationDocument extends MongooseDocument{
     userId: mongoose.Types.ObjectId
}