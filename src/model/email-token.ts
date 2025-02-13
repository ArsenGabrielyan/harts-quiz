import { TokenDocument } from "@/data/types/mongoose-document-types";
import {Model, Schema, model, models} from "mongoose";

const tokenSchema = new Schema<TokenDocument>({
     email: {
          type: String,
          required: [true, 'It is Required'],
          ref: 'User'
     },
     token: {
          type: String,
          required: true,
          unique: true
     },
     expires: Date
},{collection: 'email-verification-tokens',versionKey:"_tokenKey"})
const EmailToken: Model<TokenDocument> = models.EmailToken || model("EmailToken",tokenSchema);
export default EmailToken