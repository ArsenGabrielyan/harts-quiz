/**
 * An array of routes that are accessible to public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes: string[] = [
     "/",
     "/explore",
     "/host",
     "/play",
     "/auth/new-verification",
]

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */
export const authRoutes: string[] = [
     "/auth/login",
     "/auth/register",
     "/auth/error",
     "/auth/reset",
     "/auth/new-password"
]

/**
 * An array of dynamic routes that are accessible to public.
 * These routes do not require authentication.
 * @type {RegExp[]}
 */
export const dynamicRoutes: RegExp[] = [
     /^\/users\/[^/]+$/,
     /^\/explore\/[^/]+$/,
     /^\/play\/[^/]+$/,
     /^\/sounds\/[^/]+$/,
]

/**
 * The prefix for API authentication routes.
 * Routes that started with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth"

/**
 * The default redirect path after logging in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/"