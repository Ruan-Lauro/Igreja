import { users } from "@/hooks/useGetUsers";
import Cookies from "js-cookie";

export const setCookie = (key: string, value: users, days: number = 7) => {
    Cookies.set(key, JSON.stringify(value), { expires: days, path: "/" });
};

export const getCookie = (key: string) => {
    const cookieValue = Cookies.get(key);
    return cookieValue ? JSON.parse(cookieValue) : null;
};

export const removeCookie = (key: string) => {
    Cookies.remove(key, { path: "/" });
};

export const updateCookie = (key: string, newValue: users, days: number = 7) => {
    Cookies.set(key, JSON.stringify(newValue), { expires: days, path: "/" });
};  