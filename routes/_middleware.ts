import { define } from "../utils.ts";
import { getAuthUser } from "../lib/auth.ts";

export default define.middleware(async (ctx) => {
  const url = new URL(ctx.req.url);

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/auth/callback",
    "/forgot-password",
    "/reset-password",
    "/privacy",
    "/terms",
    "/api/auth/session",
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some((route) =>
    url.pathname === route || url.pathname.startsWith("/api/auth/")
  ) || url.pathname.startsWith("/@") || // Dynamic route: /@[username]
    url.pathname.startsWith("/api/links/redirect/"); // Redirect endpoint link: /api/links/redirect/:id

  // Static files and assets
  const isStaticFile = url.pathname.startsWith("/static/") ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.match(/\.(ico|svg|png|jpg|jpeg|gif|css|js)$/);

  if (isStaticFile) {
    return ctx.next();
  }

  // Get authenticated user
  const authUser = await getAuthUser(ctx.req);

  // Store auth user in context state
  ctx.state.authUser = authUser || undefined;

  // Redirect to login if accessing protected route without auth
  if (!isPublicRoute && !authUser) {
    return new Response("", {
      status: 302,
      headers: {
        Location: `/login?redirect=${encodeURIComponent(url.pathname)}`,
      },
    });
  }

  // Redirect authenticated users away from auth pages
  if (authUser && (url.pathname === "/login" || url.pathname === "/register")) {
    return new Response("", {
      status: 302,
      headers: { Location: "/dashboard" },
    });
  }

  return ctx.next();
});
