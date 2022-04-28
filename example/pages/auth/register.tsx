import { useFirebase } from "@bluesky-digital-labs/next-firebase-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";

const AuthLoginPage = () => {
  const { auth } = useFirebase();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await auth.email.register({ email, password, redirect: "/" });

    router.push("/");
  };

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <Link href="/auth/login">Login</Link>
      <Link href="/auth/forgot-password">Forgot Password</Link>
    </>
  );
};

export default AuthLoginPage;
