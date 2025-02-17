import { TokenDocument } from "@/data/types/mongoose-document-types";
import mongoose, {Model, Schema, model} from "mongoose";

const tokenSchema = new Schema<TokenDocument>({
     email: {
          type: String,
          required: [true, "Email is Required"],
          unique: [true, "Email Should Be Unique"]
     },
     token: {
          type: String,
          required: [true, "Token is Required"],
          unique: [true, "Token Should Be Unique"]
     },
     expires: {
          type: Date,
          required: [true, "Expires Date is Required"]
     }
},{collection: 'email-verification-tokens'})
const EmailToken: Model<TokenDocument> = mongoose.models?.EmailToken || model("EmailToken",tokenSchema);
export default EmailToken