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
},{collection: 'pass-reset-tokens',versionKey:"_tokenKey"})
const PassResetToken: Model<TokenDocument> = models.PassResetToken || model("PassResetToken",tokenSchema);
export default PassResetToken