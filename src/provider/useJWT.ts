import type { ParsedToken, User } from "firebase/auth";
import { destroyCookie, setCookie } from "nookies";
import { useEffect, useState } from "react";
import { JWT_COOKIE_NAME } from "../config";

export const useJWT = (user: User | null, initialJwt?: string) => {
  const [jwt, setJwt] = useState<string | undefined>(initialJwt);
  const [claims, setClaims] = useState<ParsedToken | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const jwt = await user.getIdToken();

      setJwt(jwt);

      const { expirationTime, claims } = await user.getIdTokenResult();

      setClaims(claims);

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

  const clear = () => {
    destroyCookie(null, JWT_COOKIE_NAME);
    setJwt(undefined);
  };

  return { jwt, claims, clear };
};
