import {Schema, model, models} from "mongoose";

const tokenSchema = new Schema({
     id: {
          type: String,
          required: [true, 'It is Required'],
          ref: 'User'
     },
     token: {
          type: String,
          required: true
     },
     createdAt: {
          type: Date,
          default: new Date()
     }
},{collection: 'pass-reset-tokens',versionKey:"_tokenKey"})
const PassResetToken = models.PassResetToken || model("PassResetToken",tokenSchema);
export default PassResetToken