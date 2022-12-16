import CookieManager from "../utils/CookieManager";
import { useEffect, useState } from "react";

/**
 * Hook to track a cookie value change
 * @param callback the function to call when the cookie value changed
 * @param cookieName the name of the cookie tracked
 */
export function useCookie(callback: (value: string) => void, cookieName: string) {
	useEffect(() => {
		const id = CookieManager.onCookieChange(cookieName, callback);
		return () => CookieManager.removeListener(cookieName, id);
	}, [callback, cookieName]);
}