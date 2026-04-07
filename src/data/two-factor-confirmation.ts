import { db } from "@/lib/db";
import { cache } from "react";

export const getTwoFactorConfirmationByUserId = cache(async(userId: string) => {
     try{
          const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
               where: {userId}
          })
          return twoFactorConfirmation
     } catch {
          return null
     }
})