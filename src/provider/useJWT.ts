import { User } from "firebase/auth";
import { setCookie } from "nookies";
import { useEffect, useState } from "react";
import { JWT_COOKIE_NAME } from "../config";

export const useJWT = (user: User | null, initialJwt?: string) => {
  const [jwt, setJwt] = useState<string | undefined>(initialJwt);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const jwt = await user.getIdToken();

      setJwt(jwt);

      const { expirationTime } = await user.getIdTokenResult();

      // expiration time is the date when the token expires, maxAge is how many seconds in the future it will expire
      const maxAge = Math.floor((new Date(expirationTime).getTime() - Date.now()) / 1000);

      setCookie(null, JWT_COOKIE_NAME, jwt, {
        path: "/",
        sameSite: true,
        secure: true,
        maxAge,
      });
    })();
  }, [user]);

  return jwt;
};
