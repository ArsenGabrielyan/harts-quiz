import { UserDocument } from "@/data/types/mongoose-document-types";
import mongoose, {Schema, Model, model} from "mongoose";

const userSchema = new Schema<UserDocument>({
     name: {
          type: String,
          required: [true,'Name is Required']
     },
     email: {
          type: String,
          required: [true,'Email Is Required'],
          unique: [true,'Keep Email Unique']
     },
     username: {
          type: String,
          index: {unique: true, sparse: true}
     },
     organization: String,
     password: String,
     image: String,
     birthDate: Date,
     accountType: String,
     emailVerified: Date,
     isTwoFactorEnabled: {
          type: Boolean,
          default: false
     },
     soundEffectOn: {
          type: Boolean,
          default: false,
     },
     showFavoriteSubject: {
          type: Boolean,
          default: true,
     },
     bio: String,
     favorites: [String],
     favoriteSubject: String,
},{versionKey: "_userKey",collection: 'user-list'});
const User: Model<UserDocument> = mongoose.models.User || model("User",userSchema);
export default User