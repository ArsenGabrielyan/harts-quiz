import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { getUserById } from "@/data/user"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { generateUsername } from "./lib/helpers"
import { SubjectName } from "./lib/types"
import { db } from "./lib/db"
import { getAccountByUserId } from "./data/account"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { AccountType } from "@prisma/client"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({user}){
      const existingUser = await db.user.findUnique({
        where: {
          id: user?.id
        }
      })
      const username = generateUsername(existingUser?.name.toLowerCase().split(" ")[0])
      await db.user.update({
        where: {
          id: user.id
        },
        data: {
          emailVerified: new Date(),
          username,
          accountType: "personal",
        }
      })
    }
  },
  callbacks: {
    async signIn({user, account}){
      // Allow OAuth Without Email Verification
      if(account?.provider!=="credentials") return true;

      const existingUser = await getUserById(user.id as string)

      // Prevent Sign In Without a Verification
      if(!existingUser?.emailVerified) return false

      if(existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if(!twoFactorConfirmation) return false;

        // Delete 2FA Confimration For Next Sign In
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id
          }
        })
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

      const existingUser = await getUserById(token.sub)

      if(!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

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
      token.isOauth = !!existingAccount;

      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 3*24*60*60,
  },
  ...authConfig,
})