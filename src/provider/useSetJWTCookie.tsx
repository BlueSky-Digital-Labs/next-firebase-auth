import { useEffect } from "react";
import { User } from "firebase/auth";
import { JWT_COOKIE_NAME } from "../config";
import { setCookie } from "nookies";

export const useSetJWTCookie = (user: User | null) => {
  useEffect(() => {
    if (!user) return;
    (async () => {
      const jwt = await user.getIdToken();

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

  return;
};
