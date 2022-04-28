# next-firebase-auth
A collection of providers, hooks and functions to authenticate users using firebase

[![npm version](https://badge.fury.io/js/@bluesky-digital-labs%2Fnext-firebase-auth.svg)](https://www.npmjs.com/package/@bluesky-digital-labs/next-firebase-auth)

# Usage

## Step 1. Install

```bash
npm install @BlueSky-Digital-Labs/next-firebase-auth
```

## Step 2. Add Firebase config to your project

Either in the env section of `next.config.js` or in a file called `.env` or `.env.local` / `.env.development` / `.env.production` / `.env.test`, please fill out these environment variables:

- `NEXT_PUBLIC_FIREBASE_API_Key`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Some of these are optional, just use the ones firebase has provided.

## Step 3. Add `<FirebaseProvider>` around your app.
I recommend you do this in `pages/_app.tsx`. Using the `useFirebase` in a component that is outside of the provider will not work.

```tsx
import type { AppProps } from "next/app";
import { FirebaseProvider } from "@bluesky-digital-labs/next-firebase-auth";

const MyApp = ({ pageProps }: AppProps) => {
  return (
    <FirebaseProvider>
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
  - `user` is the current user, will be `null` if the user is signed out, but once they use a sign in method, this becomes populated.
  - `loading` is a boolean, its true while firebase is initialising and while it checks if the user is logged in.
  - `auth` contains a range of methods to sign in the user, and some to manage accounts that use email and password. Please see the reference below.
  - `logout` is a function that will log the user out, setting `user` to null.

## Other Hooks

### `useValidPasswordResetCode`, a hook that tells you if a reset code is valid or not.

```tsx
import { useValidPasswordResetCode } from "@bluesky-digital-labs/next-firebase-auth";

const ResetPassword = ({ code }: { code: string }) => {
  const { email, valid, loading } = useValidPasswordResetCode({ code });

  return <></>;
}
```

  - `email` is the email that the reset code was sent to.
  - `valid` is a boolean, its true if the code is valid, false if not.
  - `loading` is a boolean, its true while the code is being checked.

### `useVerifyEmail`, a hook that verify's an email

```tsx
const VerifyEmail = ({ code }: { code: string }) => {
  const { loading, success } = useVerifyEmail({ code });

  return <></>;
};
```

  - `loading` is a boolean, its true while the code is being checked.
  - `success` is a boolean, its true if firebase successfully verified the email.

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

# Auth functions

### Email Login
The traditional method, sign a user in with there email and password.
```tsx
await auth.email.login({ email, password });
```

### Update Password
The user needs to be signed in to use this update password function.
```tsx
await auth.email.updatePassword({ newPassword });
```

### Email Register
On Register, a user is sent an email verification link.
```tsx
await auth.email.register({ email, password });
```

### Email Verify
After clicking on the link from the verification email, use this function to verify the user.
```tsx
await auth.email.verify({ code });
```

### Forgot Password
Send a reset password email to the user.
```tsx
await auth.email.sendPasswordResetEmail({ email });
```

### Verify Password Reset Code
On page load, check a users code from there email to see if its still valid. This function returns the users email, you can use it to sign in the user once they have set there new password. It will through an error if the code is not valid, so put it in a try catch.
```tsx
const email = await auth.email.verifyPasswordResetCode({ code });
```

### Confirm Password Reset
Call this function to set the users new password, it needs to the code.
```tsx
await auth.email.confirmPasswordReset({ code, newPassword });
```

### Send SignIn Link To Email
This is like Anonymous sign in, but has the security of forcing the user to use an email. This sends them an email with a link, they click on the link bringing them back to the website with the code.
```tsx
await auth.email.sendSignInLinkToEmail({ email });
```

### SignIn With Email Link
After the user clicks on the link from the email, use this function to sign in the user.
```tsx
await auth.email.signInWithEmailLink({ email, code });
```

### Anonymous Sign In
Great if you need a userId, but don't want the user to go through the hassle of signing up.
```tsx
await auth.anonymous();
```

### Google Sign In
Opens up a pop-up window to sign in with Google.
```tsx
await auth.google();
```

### Facebook Sign In
Opens up a pop-up window to sign in with Facebook.
```tsx
await auth.facebook();
```

### Apple Sign In
Opens up a pop-up window to sign in with Apple.
```tsx
await auth.apple();
```


### Twitter Sign In
Opens up a pop-up window to sign in with Twitter.
```tsx
await auth.twitter();
```

### Github Sign In
Opens up a pop-up window to sign in with Github.
```tsx
await auth.github();
```

### Microsoft Sign In
Opens up a pop-up window to sign in with Microsoft.
```tsx
await auth.microsoft();
```

# Development

## Clone

`gh repo clone BlueSky-Digital-Labs/next-firebase-auth`

## Setup

`npm install`

## build

`npm run build`

## Publish

`npm run release`
  - select major if changing the way the package works
  - select minor if adding a new feature
  - select patch if making a bug fix or internal change