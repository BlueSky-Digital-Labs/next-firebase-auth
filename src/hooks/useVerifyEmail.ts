import { useEffect, useState } from "react";
import { useFirebase } from "../index";

export const useVerifyEmail = ({ code }: { code: string }) => {
  const { auth } = useFirebase();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await auth.email.verify({ code });
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
