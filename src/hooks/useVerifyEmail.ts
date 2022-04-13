import { useFirebase } from "../index";
import { useEffect, useState } from "react";

export const useVerifyEmail = ({ code }: { code: string }) => {
  const { auth } = useFirebase();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await auth.email.verifyEmail({ code });
        setSuccess(true);
      } catch (error) {
        setSuccess(false);
        throw error;
      } finally {
        setLoading(false);
      }
    })();
  }, [auth]);

  return { loading, success };
};
