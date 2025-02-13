import mongoose from "mongoose"
import { AccountType, IQuestion, QuizVisibility } from "./other-types"

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
     birthDate: Date,
     accountType: AccountType,
     emailVerified: Date,
     isTwoFactorEnabled: boolean,
     soundEffectOn: boolean,
     showFavoriteSubject: boolean,
     bio: string,
     favoriteSubject: string,
     favorites: string[]
}
export interface QuizDocument extends MongooseDocument{
     name: string,
     teacher: string,
     teacherEmail: string,
     description: string,
     questions: IQuestion[],
     visibility: QuizVisibility,
     subject: string,
     createdAt: Date
}