import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPageContext } from "next";

import { FirebaseProvider, getToken } from "@bluesky-digital-labs/next-firebase-auth";

function MyApp({ Component, pageProps, jwt }: AppProps & { jwt: string }) {
  return (
    <FirebaseProvider initialJwt={jwt}>
      <Component {...pageProps} />
    </FirebaseProvider>
  );
}

export default MyApp;

MyApp.getInitialProps = async ({ ctx: { req } }: { ctx: NextPageContext }) => {
  if (!req) {
    return {};
  }

  const jwt = getToken(req);

  return { jwt };
};
