import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Regex to check whether something has an extension, e.g. .jpg
const PUBLIC_FILE = /\.(.*)$/;
const LOCALES = ["en", "fr"];

const nonI18nPaths = [
	"/404",
	"/500",
	"/_error",
	"/_next",
	"/api",
	"/redirects",
];

export function middleware(request: NextRequest) {
	const { nextUrl, headers } = request;
	// Cloned url to work with
	const url = nextUrl.clone();

	try {
		// Early return if it is a public file such as an image or an api call
		if (
			PUBLIC_FILE.test(nextUrl.pathname) ||
			nextUrl.pathname.includes("/api") ||
			nextUrl.pathname.includes("/_next")
		) {
			return undefined;
		}

		// Check if he specified a locale in the url or trying to access a nonI18nPath
		const firstPath = url.pathname.split("/")[1];
		if (LOCALES.includes(firstPath) || nonI18nPaths.includes(firstPath)) {
			return undefined;
		}

		// Check if the locale is specified in headers

		// Get all the languages the client accepts
		const headerLocales = headers.get("accept-language")?.split(",") || [];

		for (let i = 0; i < headerLocales.length; i++) {
			// If the language is supported we redirect to the url with the language
			const headerLocale = headerLocales[i].split("-")[0].toLowerCase();
			if (LOCALES.includes(headerLocale)) {
				url.pathname = `/${headerLocale}${url.pathname}${url.search}${url.hash}`;
				return NextResponse.redirect(url);
			}
		}

		// Otherwise we redirect to en by default
		url.pathname = `/en${url.pathname}${url.search}${url.hash}`;
		return NextResponse.redirect(url);
	} catch (error) {
		console.log(error);
	}
}
