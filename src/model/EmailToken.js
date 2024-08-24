import {Schema, model, models} from "mongoose";

const tokenSchema = new Schema({
     email: {
          type: String,
          required: [true, 'It is Required'],
          ref: 'User'
     },
     token: {
          type: String,
          required: true
     },
     expirationDate: Date
},{collection: 'email-verification-tokens',versionKey:"_tokenKey"})
const EmailToken = models.EmailToken || model("EmailToken",tokenSchema);
export default EmailToken