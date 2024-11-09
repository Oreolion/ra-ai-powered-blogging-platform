const authConfig = {
    providers: [
      {
        domain: process.env.NEXT_PUBLIC_CLERK_AUTH_DOMAIN,
        applicationID: "convex",
      },
    ],
  };
  
  export default authConfig;