import { IncomingMessage } from 'http';
import { parseCookies } from 'nookies';
import { JWT_COOKIE_NAME } from "./config";

export const getToken = (req: IncomingMessage): string => {
  const cookies = parseCookies({ req });
  return cookies[JWT_COOKIE_NAME];
}