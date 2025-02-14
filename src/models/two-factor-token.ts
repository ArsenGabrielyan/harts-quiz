import { TokenDocument } from "@/data/types/mongoose-document-types";
import mongoose, {Model, Schema, model} from "mongoose";

const TwoFactorTokenSchema = new Schema<TokenDocument>({
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
},{collection: "two-factor-tokens"})

const TwoFactorToken: Model<TokenDocument> = mongoose.models?.TwoFactorToken || model("TwoFactorToken",TwoFactorTokenSchema);

export default TwoFactorToken