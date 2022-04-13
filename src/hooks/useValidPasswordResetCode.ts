import { useState, useEffect } from "react";
import { useFirebase } from "../index";

export const useValidPasswordResetCode = ({ code }: { code: string }) => {
  const { auth } = useFirebase();

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const email = await auth.email.verifyPasswordResetCode({ code });
        setEmail(email);
        setValid(true);
      } catch (error) {
        setValid(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [code, auth]);

  return { valid, email, loading };
};
