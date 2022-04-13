# next-firebase-auth
A collection of providers, hooks and functions to authenticate users using firebase


## Setup

`npm install`

## build

`npm run build`

## Publish

`npm run release`
  - select major if changing the way the package works
  - select minor if adding a new feature
  - select patch if making a bug fix or internal change

# Usage

To setup, please adding the Provider around your app, I recommend you do this in `pages/_app.tsx`.
Then replace the domain, with the domain you are using, in dev this will be localhost:3000. 
My recommendation is to store this in an environment variable.

```tsx
import type { AppProps } from "next/app";
import { FirebaseProvider } from "@bluesky-digital-labs/next-firebase-auth";

const MyApp = ({ pageProps }: AppProps) => {
  return (
    <FirebaseProvider domain={"http://localhost:3000"}>
      <Component {...pageProps} />
    </FirebaseProvider>
  );
};
```

## To consume the provider use `useFirebase`, the main hook exposed by the library.

```tsx
import { useFirebase } from "@bluesky-digital-labs/next-firebase-auth";

const MyComponent = () => {
  const { user, loading, auth, logout } = useFirebase();

  return <></>;
};
```

This hook has four main properties, `user`, `loading`, `auth` and `logout`.
  - `user` is the current user, if there is one.
  - `loading` is a boolean, its true while firebase is initialising and while it checks if the user is logged in.
  - `auth` contains a range of methods to sign in the user, and some to manage accounts that use email and password.
  - `logout` is a function that will log the user out, setting `user` to null.

## Server Side

To use the users api key server side, use the `getToken` function.

```tsx
import type { GetServerSideProps } from "next";
import { getToken } from "@bluesky-digital-labs/next-firebase-auth";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

  const token = getToken(req);

};
```

## Note

If the user is signed in, the token is available on the first page load server side. But, client side the user is not signed in as they must wait for firebase to initialise and check if the user is signed in. What this means that if you client side listen to `loading` and block the page from rendering to ensure the user logs in, you will have a bad user experience. You do not need to ensure the user is signed in client side on this first page load. As any data you load server side from the api, we know is allowed as the api has already verified the user is signed in. The one downside is on a user settings page, it will need to be blocked, but this is rare.