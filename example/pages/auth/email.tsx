import { useFirebase, useValidPasswordResetCode, useVerifyEmail } from "@bluesky-digital-labs/next-firebase-auth";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";

// Partial as anyone could go to this url with one, zero or any array of query params
// so need to assume these are undefined until checked
type Query = Partial<{
  mode: "resetPassword" | "verifyEmail";
  oobCode: string;
  // no idea what the apiKey is used for right now, need to research in to its use
  apiKey: string;
  continueUrl: string;
}>;

function AuthEmailActions() {
  const router = useRouter();

  const { mode: action, oobCode: code, continueUrl } = router.query as Query;

  if (!code) {
    return null;
    throw new Error("No code found");
  }

  if (!continueUrl) {
    return null;
    throw new Error("No continueUrl found");
  }

  const handleCompletion = () => {
    router.push(continueUrl);
  };

  if (action === "resetPassword") {
    return <ResetPassword code={code} onCompletion={handleCompletion} />;
  }

  if (action === "verifyEmail") {
    return <VerifyEmail code={code} onCompletion={handleCompletion} />;
  }

  return <span>Loading...</span>;
}

export default AuthEmailActions;

interface ResetPasswordProps {
  code: string;
  onCompletion: () => void;
}

const ResetPassword = ({ code, onCompletion }: ResetPasswordProps) => {
  const { auth } = useFirebase();
  const { email, valid, loading } = useValidPasswordResetCode({ code });

  const [newPassword, setNewPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await auth.email.confirmPasswordReset({ code, newPassword });

    if (email) {
      await auth.email.login({ email, password: newPassword });
    }

    onCompletion();
  };

  if (loading) {
    return <span>Loading...</span>;
  }

  if (!valid) {
    return <div>Invalid code</div>;
  }

  return (
    <>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>New Password</label>
        <input
          name="newPassword"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </>
  );
};

interface VerifyEmailProps {
  code: string;
  onCompletion: () => void;
}

const VerifyEmail = ({ code, onCompletion }: VerifyEmailProps) => {
  const { loading, success } = useVerifyEmail({ code });

  if (loading) {
    return <span>Loading...</span>;
  }

  if (success) {
    onCompletion();
  } else {
    throw new Error("Verification failed");
  }

  return <span>Loading...</span>;
};
