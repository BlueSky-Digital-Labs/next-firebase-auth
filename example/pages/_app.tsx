import "../styles/globals.css";
import type { AppProps } from "next/app";

import { FirebaseProvider } from "@bluesky-digital-labs/next-firebase-auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <Component {...pageProps} />
    </FirebaseProvider>
  );
}

export default MyApp;
