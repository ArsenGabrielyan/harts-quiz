import type {DefaultSession} from "next-auth"
import { AccountType } from "./data/types/other-types"

export type ExtendedUser = DefaultSession["user"] & {
  isTwoFactorEnabled: boolean,
  accountType: AccountType,
  username: string
}

declare module "next-auth"{
  interface Session{
    user: ExtendedUser
  }
}