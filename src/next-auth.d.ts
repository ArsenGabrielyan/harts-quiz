import type {DefaultSession} from "next-auth"
import { AccountType, SubjectName } from "./data/types/other-types"

export type ExtendedUser = DefaultSession["user"] & {
  username: string,
  organization: string,
  accountType: AccountType,
  isTwoFactorEnabled: boolean,
  soundEffectOn: boolean,
  showFavoriteSubject: boolean,
  bio: string,
  favoriteSubject: SubjectName
  isOauth: boolean
}

declare module "next-auth"{
  interface Session{
    user: ExtendedUser
  }
}