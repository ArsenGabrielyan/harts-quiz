import {Schema, model, models} from "mongoose";

const userSchema = new Schema({
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
     image: Schema.Types.Mixed,
     userId: {
          type: String,
          unique: [true, 'Duplicate User ID']
     },
     bdate: Schema.Types.Mixed,
     accountType: String,
     isAccountNew: {
          type: Boolean,
          default: true,
     },
     isEmailVerified: {
          type: Boolean,
          default: false
     },
     isOauth: {
          type: Boolean,
          default: false,
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
const User = models.User || model("User",userSchema);
export default User