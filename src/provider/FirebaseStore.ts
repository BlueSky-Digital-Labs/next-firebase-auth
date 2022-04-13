import type { FirebaseApp } from "firebase/app";
import type { Auth, User } from "firebase/auth";

// You may ask why are all the login functions returning void when they could return the user
// this is to force developers to use the firebase hook to access user instead of trying
// to create another provider just to store the user in state

export interface FirebaseStore {
  user: User | null;
  jwt: string | undefined;
  loading: boolean;
  logout: () => Promise<void>;
  auth: {
    email: {
      login: ({ email, password }: Credentials) => Promise<void>;
      updatePassword: ({ newPassword }: { newPassword: string }) => Promise<void>;
      register: ({ email, password, redirect }: Credentials & { redirect: string }) => Promise<void>;
      verify: ({ code }: { code: string }) => Promise<void>;
      sendPasswordResetEmail: ({ email, redirect }: { email: string; redirect: string }) => Promise<void>;
      verifyPasswordResetCode: ({ code }: { code: string }) => Promise<string>;
      confirmPasswordReset: ({ code, newPassword }: { code: string; newPassword: string }) => Promise<void>;
      sendSignInLinkToEmail: ({ email, redirect }: { email: string; redirect: string }) => Promise<void>;
      signInWithEmailLink: ({ email, code }: { email: string; code: string }) => Promise<void>;
    };
    anonymous: () => Promise<void>;
    google: () => Promise<void>;
    facebook: () => Promise<void>;
    apple: () => Promise<void>;
    twitter: () => Promise<void>;
    github: () => Promise<void>;
    microsoft: () => Promise<void>;
  };
  firebaseApp: FirebaseApp | undefined;
  firebaseAuth: Auth | undefined;
}

export interface Credentials {
  email: string;
  password: string;
}
