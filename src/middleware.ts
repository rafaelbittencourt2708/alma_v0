import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      return Response.redirect(signInUrl);
    }

    // If the user is signed in and trying to access sign-in/sign-up pages,
    // redirect them to the dashboard
    if (auth.userId && (
      req.nextUrl.pathname.startsWith('/sign-in') ||
      req.nextUrl.pathname.startsWith('/sign-up')
    )) {
      const dashboard = new URL('/dashboard', req.url);
      return Response.redirect(dashboard);
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
