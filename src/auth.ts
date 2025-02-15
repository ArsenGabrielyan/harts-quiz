import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import {MongoDBAdapter} from "@auth/mongodb-adapter"
import client from "./lib/mongodb/db"
import { connectDB } from "./lib/mongodb/mongoose"
import { getUserById } from "@/data/db/user"
import User from "@/models/user"
import { getTwoFactorConfirmationByUserId } from "@/data/db/two-factor-confirmation"
import TwoFactorConfirmation from "./models/two-factor-confirmation"
import { generateUsername } from "./data/helpers"
import { AccountType, SubjectName } from "./data/types/other-types"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({user}){
      await connectDB();
      const existingUser = await User.findById(user.id);
      const username = generateUsername(existingUser?.name.toLowerCase().split(" ")[0])
      await User.findByIdAndUpdate(user.id,{
        $set: {
          emailVerified: new Date(),
          username,
          soundEffectOn: false,
          showFavoriteSubject: true,
          isOauth: true,
          accountType: "personal",
          favorites: []
        }
      })
    }
  },
  callbacks: {
    async signIn({user, account}){
      // Allow OAuth Without Email Verification
      if(account?.provider!=="credentials") return true;

      await connectDB();
      const existingUser = await getUserById(user.id as string)

      // Prevent Sign In Without a Verification
      if(!existingUser?.emailVerified) return false

      if(existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser._id);

        if(!twoFactorConfirmation) return false;

        // Delete 2FA Confimration For Next Sign In
        await TwoFactorConfirmation.findByIdAndDelete(twoFactorConfirmation._id)
      }

      return true;
    },
    async session({ token, session }){
      if(token.sub && session.user){
        session.user.id = token.sub
      }

      if(session.user){
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.username = token.username as string
        session.user.organization = token.organization as string;
        session.user.accountType = token.accountType as AccountType
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
        session.user.soundEffectOn = token.soundEffectOn as boolean
        session.user.showFavoriteSubject = token.showFavoriteSubject as boolean;
        session.user.bio = token.bio as string;
        session.user.favoriteSubject = token.favoriteSubject as SubjectName;
        session.user.isOauth = token.isOauth as boolean
      }

      return session
    },
    async jwt({token}){
      if(!token.sub) return token

      await connectDB();
      const existingUser = await getUserById(token.sub)

      if(!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.username = existingUser.username
      token.organization = existingUser.organization;
      token.accountType = existingUser.accountType;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      token.soundEffectOn = existingUser.soundEffectOn;
      token.showFavoriteSubject = existingUser.showFavoriteSubject;
      token.bio = existingUser.bio;
      token.favoriteSubject = existingUser.favoriteSubject;
      token.isOauth = existingUser.isOauth;

      return token
    }
  },
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
    maxAge: 3*24*60*60,
  },
  ...authConfig,
})