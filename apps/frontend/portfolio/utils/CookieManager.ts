import Cookies from "js-cookie";

class CookieManager {
	// Instance of the cookie manager
	private static instance: CookieManager;

	// All Listener for cookie change
	private listeners: Map<string, Map<number, (value: string) => void>> =
		new Map();

	// Private constructor to prevent creating new instances
	constructor() {
		if (CookieManager.instance) {
			return CookieManager.instance;
		}
		CookieManager.instance = this;
		return this;
	}

	public getCookie(name: string): string {
		return Cookies.get(name);
	}
	public static getCookie(name: string): string {
		return CookieManager.instance.getCookie(name);
	}

	public setCookie(
		name: string,
		value: string,
		options?: Cookies.CookieAttributes
	) {
		const oldValue = this.getCookie(name);
		Cookies.set(name, value, options);
		// trigger all listeners if value changed
		if (oldValue !== value && this.listeners.has(name)) {
			this.listeners.get(name).forEach((callback) => callback(value));
		}
	}
	public static setCookie(
		name: string,
		value: string,
		options?: Cookies.CookieAttributes
	) {
		CookieManager.instance.setCookie(name, value, options);
	}

	public removeCookie(name: string, options?: Cookies.CookieAttributes) {
		Cookies.remove(name, options);
		// trigger all listeners with a null value
		if (this.listeners.has(name)) {
			this.listeners.get(name).forEach((callback) => callback(null));
		}
		// remove all listeners
		this.listeners.delete(name);
	}
	public static removeCookie(
		name: string,
		options?: Cookies.CookieAttributes
	) {
		CookieManager.instance.removeCookie(name, options);
	}

	public onCookieChange(
		name: string,
		callback: (value: string) => void,
		id: number = -1
	) {
		if (id === -1) {
			id = Math.random();
		}
		if (!this.listeners.has(name)) {
			this.listeners.set(name, new Map());
		}
		this.listeners.get(name).set(id, callback);
		// trigger the callback with the current value
		callback(this.getCookie(name));
		return id;
	}
	public static onCookieChange(
		name: string,
		callback: (value: string) => void
	) {
		CookieManager.instance.onCookieChange(name, callback);
	}

	public removeListener(name: string, id: number) {
		if (this.listeners.has(name)) {
			this.listeners.get(name).delete(id);
		}
	}
}

export default new CookieManager();
