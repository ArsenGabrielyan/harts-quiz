import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import {
     DEFAULT_LOGIN_REDIRECT,
     apiAuthPrefix,
     authRoutes,
     dynamicRoutes,
     publicRoutes
} from "@/routes"

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
     const {nextUrl, auth} = req;
     const isLoggedIn = !!auth;

     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
     const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
     const isAuthRoute = authRoutes.includes(nextUrl.pathname);
     const isDynamicProtectedRoute = dynamicRoutes.some((route) => route.test(nextUrl.pathname))

     if(isApiAuthRoute) {
          return NextResponse.next()
     }

     if(isAuthRoute){
          if(isLoggedIn){
               return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
          }
          return NextResponse.next()
     }

     if(!isLoggedIn && !isPublicRoute && !isDynamicProtectedRoute) {
          let callbackUrl = nextUrl.pathname;
          if(nextUrl.search){
               callbackUrl += nextUrl.search
          }
          const encodedCallbackUrl = encodeURI(callbackUrl)
          return NextResponse.redirect(new URL(
               `/auth/login?callbackUrl=${encodedCallbackUrl}`,
               nextUrl
          ))
     }
     return NextResponse.next()
})

export const config = {
     matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)','/(api|trpc)(.*)',]
}