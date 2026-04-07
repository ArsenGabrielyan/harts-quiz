import { db } from "@/lib/db";
import { cache } from "react";

export const getUserById = cache(async (id: string) => {
     try{
          const user = await db.user.findUnique({
               where: {id},
               include: {
                    favorites: true
               }
          })
          return user
     } catch {
          return null
     }
})

export const getUserByEmail = cache(async (email: string) => {
     try{
          const user = await db.user.findUnique({
               where: {email}
          })
          return user;
     } catch{
          return null
     }
})

export const getUserByUsername = cache(async (username: string) => {
     try{
          const user = await db.user.findUnique({
               where: {username}
          })
          return user;
     } catch {
          return null;
     }
})