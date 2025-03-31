import { authMiddleware, redirectToSignIn, clerkClient } from "@clerk/nextjs";

export default authMiddleware({
  ignoredRoutes: ["/"],
  async afterAuth(auth, req) {
    if (auth.userId) {
      const user = await clerkClient.users.getUser(auth.userId);
      const email = user.emailAddresses[0]?.emailAddress;

      let role = "guest";
      if (email === "hoangtest.skyf@gmail.com") {
        role = "student";
      } else if (email === "thinhtest.skyf@gmail.com") {
        role = "teacher";
      }

      if (user.publicMetadata.role !== role) {
        await clerkClient.users.updateUser(auth.userId, {
          publicMetadata: { role },
        });
      }
    }

    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
