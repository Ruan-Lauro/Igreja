import Cookies from "js-cookie";

export const setCookie = (key: string, value: any, days: number = 7) => {
    Cookies.set(key, JSON.stringify(value), { expires: days, path: "/" });
};

export const getCookie = (key: string) => {
    const cookieValue = Cookies.get(key);
    return cookieValue ? JSON.parse(cookieValue) : null;
};

export const removeCookie = (key: string) => {
    Cookies.remove(key, { path: "/" });
};

export const updateCookie = (key: string, newValue: any, days: number = 7) => {
    Cookies.set(key, JSON.stringify(newValue), { expires: days, path: "/" });
};  