import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod"

export const env = createEnv({
     server: {
          DATABASE_URL: z.string().min(1,"Database URL is required"),
          GOOGLE_ID: z.string().min(1,"Google's client ID is required"),
          GOOGLE_SECRET: z.string().min(1,"Google's client secret key is required"),
          FACEBOOK_ID: z.string().min(1,"Facebook's client ID is required"),
          FACEBOOK_SECRET: z.string().min(1,"Facebook's client secret key is required"),
          RESEND_API_KEY: z.string().min(1,"Resend's api key is required"),
          ONBOARDING_EMAIL: z.string().min(1,"Please add the Onboarding email used by Resend").email("Onboarding email should be valid"),
          AUTH_SECRET: z.string().min(1,"Next Auth's secret key is required"),
          AUTH_URL: z.string().min(1,"Next Auth URL is required").url("Next Auth URL should be a valid URL"),
     },
     client: {
          NEXT_PUBLIC_APP_URL: z.string().min(1,"Main app URL is required").url("Main app URL should be a valid URL"),
     },
     experimental__runtimeEnv: {
          NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
     },
     emptyStringAsUndefined: true
})