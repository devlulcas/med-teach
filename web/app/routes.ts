import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signin", "routes/signin.tsx"),
  route("signup", "routes/signup.tsx"),
  route("api/auth/*", "routes/api.auth.$.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("api/accountability-log/*", "routes/api.accountability-log.$.tsx"),
] satisfies RouteConfig;
