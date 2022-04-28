import { GetServerSideProps } from "next";
import Link from "next/link";

import { getToken, useFirebase } from "@bluesky-digital-labs/next-firebase-auth";

function HomePage() {
  const { user } = useFirebase();

  return (
    <>
      <main>
        <AuthButtons />
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </main>
    </>
  );
}

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // gets the jwt from the cookie
  const token = getToken(context.req);

  // pass this through header (in axios) to the api
  console.log({ token, url: context.resolvedUrl });

  // when the token is not present, it is more likely that the users token needs to be refreshed
  // so send them to this page, that gets them a new token from firebase
  // it will then redirect the user back to the original page with the token in there header
  // my recommendation is to create a wrapper around getServerSideProps that handles this on every route (that needs to server side fetch something)
  // firebase jwts seem to expire around every 5 hours, so this redirect / refresh will only happen every five hours, or when the token is expired
  if (!token) {
    return {
      redirect: {
        destination: `/auth/validate?redirect=${encodeURIComponent(context.resolvedUrl)}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      hello: "world",
    },
  };
};

const AuthButtons = () => {
  const { user, loading, logout, auth } = useFirebase();

  if (loading) {
    return <span>Loading...</span>;
  }

  if (!user) {
    return (
      <>
        <Link href="/auth/login" passHref>
          <a>
            <button>Login</button>
          </a>
        </Link>
        <button onClick={auth.google}>Login with Google</button>
      </>
    );
  }

  return <button onClick={logout}>Logout</button>;
};
