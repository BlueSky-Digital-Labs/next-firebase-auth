import { useFirebase } from "@bluesky-digital-labs/next-firebase-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

function AuthValidationPage() {
  const { user, loading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    // while loading (both firebase and the user), do nothing but wait
    if (loading) return;

    // if the user is undefined, they need to sign in
    if (!user) {
      router.push("/auth/login");
    } else {
      // if the user does exist, they need to be redirected to the original page
      const redirect = router.query.redirect as string;
      router.push(redirect);
    }
  }, [user, loading, router]);

  return (
    <>
      <span>Authenticating...</span>
    </>
  );
}

export default AuthValidationPage;
