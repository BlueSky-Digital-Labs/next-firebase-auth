import { createContext } from "react";
import { FirebaseStore } from "./FirebaseStore";

const ErrorFunction = async () => {
  throw new Error("Called outside of firebase provider");
};

export const FirebaseContext = createContext<FirebaseStore>({
  user: null,
  jwt: undefined,
  loading: true,
  logout: ErrorFunction,
  auth: {
    email: {
      login: ErrorFunction,
      updatePassword: ErrorFunction,
      register: ErrorFunction,
      verifyEmail: ErrorFunction,
      sendPasswordResetEmail: ErrorFunction,
      verifyPasswordResetCode: ErrorFunction,
      confirmPasswordReset: ErrorFunction,
      sendSignInLinkToEmail: ErrorFunction,
      signInWithEmailLink: ErrorFunction,
    },
    anonymous: ErrorFunction,
    google: ErrorFunction,
    facebook: ErrorFunction,
    apple: ErrorFunction,
    twitter: ErrorFunction,
    github: ErrorFunction,
    microsoft: ErrorFunction,
  },
  firebaseApp: undefined,
  firebaseAuth: undefined,
});