import { authMiddleware, redirectToSignIn, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  ignoredRoutes: ["/"],
  async afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      const host = req.headers.get("host");
      const protocol = req.headers.get("x-forwarded-proto") || "https";
      const pathname = new URL(req.url).pathname;
      const returnBackUrl = `${protocol}://${host}${pathname}`;
      return redirectToSignIn({ returnBackUrl });
    }

    if (auth.userId) {
      const user = await clerkClient.users.getUser(auth.userId);
      const email = user.emailAddresses[0]?.emailAddress;

      let role = "guest";
      if (email === "student@skytutor.com") {
        role = "student";
      } else if (email === "teacher@skytutor.com") {
        role = "teacher";
      }

      if (user.publicMetadata.role !== role) {
        await clerkClient.users.updateUser(auth.userId, {
          publicMetadata: { role },
        });
      }

      const url = new URL(req.url);
      const path = url.pathname;

      if (
        path === "/" ||
        path === "/home" ||
        path.includes("/sign-in") ||
        path.includes("/sign-up")
      ) {
        if (role === "teacher") {
          return NextResponse.redirect(new URL("/meeting/upcoming", req.url));
        } else {
          if (path !== "/home" && path !== "/") {
            return NextResponse.redirect(new URL("/home", req.url));
          }
        }
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
