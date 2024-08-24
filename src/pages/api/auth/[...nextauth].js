import connectDB from "@/lib/tools/connectDb";
import clientPromise from "@/lib/tools/mongodb";
import User from "@/model/User";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import {compare} from "bcrypt"
import { generateId } from "@/lib/helpers";

export default NextAuth({
     pages: {signIn: "/auth/signin"},
     providers: [
          Credentials({
               name: "Harts",
               id: "credentials",
               credentials: {
                    email: {label: "Email Address", type: 'email', placeholder: 'name@example.com'},
                    password: {label: "Password", type: 'password'}
               },
               async authorize(credentials){
                    await connectDB();
                    const user = await User.findOne({email: credentials?.email});
                    if(!user) throw new Error("Այս Օգտատերը գոյություն չունի");
                    const isPassCorrect = await compare(credentials?.password,user?.password);
                    if(!isPassCorrect) throw new Error("Գաղտնաբառը սխալ է հավաքված");
                    if(!user.isEmailVerified) throw new Error("Այս հաշիվը վերիֆիկացված չի")
                    return user;
               }
          }),
          Google({
               clientId: process.env.GOOGLE_ID,
               clientSecret: process.env.GOOGLE_SECRET,
          }),
          Facebook({
               clientId: process.env.FACEBOOK_ID,
               clientSecret: process.env.FACEBOOK_SECRET
          })
     ],
     adapter: MongoDBAdapter(clientPromise),
     session: {strategy: "jwt"},
     secret: process.env.JWT_TOKEN,
     callbacks: {
          async signIn({user, account}){
               let result = false, errTxt;
               if(account?.provider!=='credentials'){
                    try{
                         await connectDB();
                         const mentionedUser = await User.findOne({email: user.email});
                         if(!mentionedUser) {
                              const userId = generateId(10);
                              const {email,name,image} = user
                              const isTakenUsername = await User.findOne({username: name.split(' ')[0].toLowerCase()});
                              const userDetails = {
                                   name,email,image,userId,
                                   username: isTakenUsername ? `${name.split(' ')[0].toLowerCase()}-${generateId(10,'username')}` : name.split(' ')[0].toLowerCase(),accountType: 'personal',
                                   isAccountNew: true, isEmailVerified: true,bio: '',
                                   details: {favorites: [],followed: []},favoriteSubject: '',
                                   bdate: null,organization: '',password: '',isOauth: true
                              }
                              const newUser = new User(userDetails);
                              await newUser.save();
                         }
                         result = true
                    } catch(err){
                         console.error(err);
                         errTxt = err;
                         result = false;
                    }
               }
               result=!errTxt;
               if(process.env.NODE_ENV==="development") console.info("The Result of Sign In Is " + result)
               return result
          },
          async jwt({token, user, trigger, session}){
               if(trigger==='update'){
                    token.user = session.user;
               }
               if(user){
                    const {email} = user;
                    const profile = await User.findOne({email});
                    token.user = {
                         id: profile.userId,
                         email,
                         accountType: profile.accountType,
                         isOauth: profile.isOauth
                    }
               } 
               return token
          },
          async session({token, session}){
               session.user = token.user;
               return session
          },
     }
})