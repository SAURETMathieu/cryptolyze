import { staticPathnames } from "./config";

type RoutePaths = keyof typeof staticPathnames;

// all can access
export const publicRoutes: RoutePaths[] = [
  "/",
  "/help",
  "/about",
  "/contact",
  "/faq",
  "/legals",
  "/conditions",
];

// should be disconnected to access
export const authentificationRoutes = [
  "/login",
  "/signup",
  "/inscription",
  "/forgot-password",
  "/mot-de-passe-oublie",
  "/wallets",
  "/cryptos",
  "/bots",
];

// should be connected to access
export const privateRoutes = [
  "/profile/*",
  "/profil/*",
  "/logout",
  "/settings",
  "/parametres",
  "/reset-password",
];

export const apiAuthPrefix = "/api/auth";

// api routes
export const apiRoutes = [
  "/api/*",
];

export const DEFAULT_LOGIN_REDIRECT = "/";
