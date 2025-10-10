import Cookies from 'js-cookie';

type CookieAttributes = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

export const setCookie = (name: string, value: string, attributes?: CookieAttributes) => {
  Cookies.set(name, value, attributes);
};

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const removeCookie = (name: string, attributes?: CookieAttributes) => {
  Cookies.remove(name, attributes);
};
