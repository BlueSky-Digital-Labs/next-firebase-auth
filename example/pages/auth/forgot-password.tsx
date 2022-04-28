import { useFirebase } from "@bluesky-digital-labs/next-firebase-auth";
import Link from "next/link";
import { useState, FormEventHandler } from "react";

type ForgotPasswordFormData = {
  email: string;
};

const AuthForgotPasswordPage = () => {
  const { auth } = useFirebase();

  const [email, setEmail] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await auth.email.sendPasswordResetEmail({ email, redirect: "/" });

    // do something here to tell the user to check there email
  };

  return (
    <>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <Link href="/auth/login">Login</Link>
      <Link href="/auth/register">Register</Link>
    </>
  );
};

export default AuthForgotPasswordPage;
