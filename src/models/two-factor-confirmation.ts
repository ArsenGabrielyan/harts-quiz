import { TwoFactorConfirmationDocument } from "@/data/types/mongoose-document-types"
import mongoose, {Model, Schema, model} from "mongoose";

const TwoFactorConfirmationSchema = new Schema<TwoFactorConfirmationDocument>({
     userId: {
          type: Schema.Types.ObjectId,
          required: [true, "UserID Is Required For 2FA Confirmation"],
          unique: [true, "UserID Should Be Unique"],
          ref: "User"
     }
},{collection: "two-factor-confirmations"})

const TwoFactorConfirmation: Model<TwoFactorConfirmationDocument> = mongoose.models?.TwoFactorConfirmation || model("TwoFactorConfirmation",TwoFactorConfirmationSchema)

export default TwoFactorConfirmation