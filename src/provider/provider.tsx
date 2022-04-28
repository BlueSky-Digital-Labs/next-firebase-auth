import type { FirebaseApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import type { Auth, User } from "firebase/auth";
import {
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  updatePassword,
  verifyPasswordResetCode,
} from "firebase/auth";
import { destroyCookie } from "nookies";
import React, { useEffect, useState } from "react";
import { config, JWT_COOKIE_NAME } from "../config";
import { FirebaseContext } from "./FirebaseContext";
import { Credentials, FirebaseStore } from "./FirebaseStore";
import { useJWT } from "./useJWT";

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const inBrowser = typeof window !== "undefined";

  const [loading, setLoading] = useState<boolean>(true);
  const [firebaseApp] = useState<FirebaseApp | undefined>(inBrowser ? initializeApp(config) : undefined);
  const [firebaseAuth] = useState<Auth | undefined>(firebaseApp ? getAuth(firebaseApp) : undefined);
  const [user, setUser] = useState<User | null>(null);
  const jwt = useJWT(user);

  useEffect(() => {
    if (!firebaseAuth) return;
    return onAuthStateChanged(firebaseAuth, (user) => {
      // this is called both when the user logs in and out
      // either way it is no longer loading

      setLoading(false);
      setUser(user);
    });
  }, [firebaseAuth]);

  const logout = async () => {
    if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
    await signOut(firebaseAuth);
    destroyCookie(null, JWT_COOKIE_NAME);
    return;
  };

  const auth = {
    email: {
      login: async ({ email, password }: Credentials) => {
        if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        return;
      },

      updatePassword: async ({ newPassword }: { newPassword: string }) => {
        if (!user) throw new Error("User has not signed in yet");
        await updatePassword(user, newPassword);
        return;
      },

      register: async ({ email, password, redirect = "/" }: Credentials & { redirect?: string }) => {
        if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
        const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        await sendEmailVerification(user, {
          url: redirect,
        });
        return;
      },

      verify: async ({ code }: { code: string }) => {
        if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
        await applyActionCode(firebaseAuth, code);
        return;
      },

      // calling this will send an email to the user with a link to reset there password
      // redirect here is to redirect after the user sets there new password, eg the home page
      sendPasswordResetEmail: async ({ email, redirect = "/" }: { email: string; redirect?: string }) => {
        if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
        await sendPasswordResetEmail(firebaseAuth, email, {
          url: redirect,
        });
        return;
      },

      // call this on page load (in a useEffect) to check if the user has a valid password reset code
      // if its invalid, tell them it has expired and to click a button to send another link
      // if its valid, it will return the users email
      verifyPasswordResetCode: async ({ code }: { code: string }) => {
        if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
        return verifyPasswordResetCode(firebaseAuth, code);
      },

      // call this with the code from the email and get the new users password through a form
      // verifyPasswordResetCode will return the users email, so you can use it to sign the user in with there new password
      confirmPasswordReset: async ({ code, newPassword }: { code: string; newPassword: string }) => {
        if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
        await confirmPasswordReset(firebaseAuth, code, newPassword);
        return;
      },

      // if you want to sign in a user, without them setting a password
      // this will send them a code in an email
      // then call the code function to sign them in
      sendSignInLinkToEmail: async ({ email, redirect = "/" }: { email: string; redirect?: string }) => {
        if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
        await sendSignInLinkToEmail(firebaseAuth, email, {
          url: redirect,
        });
        return;
      },

      signInWithEmailLink: async ({ email, code }: { email: string; code: string }) => {
        if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
        await signInWithEmailLink(firebaseAuth, email, code);
        return;
      },
    },

    // use this when you need a user id, but don't care if the users data gets lost
    // for example tiktok uses this, people can start using the app, and there watch history
    // is tied to a user id, then later they can sign in with a provider or email and it ties the too accounts together
    // great if you want minimal friction for users to start using your app, but you lose the protection
    // that comes with other forms of registering
    anonymous: async () => {
      if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
      await signInAnonymously(firebaseAuth);
      return;
    },
    google: async () => {
      if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      return;
    },
    facebook: async () => {
      if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
      const provider = new FacebookAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      return;
    },
    apple: async () => {
      if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
      const provider = new OAuthProvider("apple.com");
      await signInWithPopup(firebaseAuth, provider);
      return;
    },
    twitter: async () => {
      if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
      const provider = new TwitterAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      return;
    },
    github: async () => {
      if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
      const provider = new GithubAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      return;
    },
    microsoft: async () => {
      if (!firebaseAuth) throw new Error("Firebase Auth has not be initialised yet");
      const provider = new OAuthProvider("microsoft.com");
      await signInWithPopup(firebaseAuth, provider);
      return;
    },
  };

  const values: FirebaseStore = {
    user,
    jwt,
    auth,
    logout,
    loading,
    firebaseApp,
    firebaseAuth,
  };

  return <FirebaseContext.Provider value={values}>{children}</FirebaseContext.Provider>;
};
