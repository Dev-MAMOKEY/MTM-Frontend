import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("profile", "routes/profile.tsx"),
  route("photos", "routes/photos.tsx"),
  route("products/:sku", "routes/products.$sku.tsx"),
] satisfies RouteConfig;
