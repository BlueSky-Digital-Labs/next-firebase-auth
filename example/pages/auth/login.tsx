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

    await auth.email.login({ email, password });

    router.push("/");
  };

  const handleGoogle = async () => {
    await auth.google();

    router.push("/");
  };

  return (
    <>
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
      <button onClick={handleGoogle}>Login With Google</button>
      <Link href="/auth/register">Register</Link>
      <Link href="/auth/forgot-password">Forgot Password</Link>
    </>
  );
};

export default AuthLoginPage;
