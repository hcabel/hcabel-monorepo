import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Regex to check whether something has an extension, e.g. .jpg
const PUBLIC_FILE = /\.(.*)$/;
const LOCALES = ["en", "fr"];

export function middleware(request: NextRequest) {
	const { nextUrl, headers } = request;
	// Cloned url to work with
	const url = nextUrl.clone();

	try {
		// Early return if it is a public file such as an image or an api call
		if (PUBLIC_FILE.test(nextUrl.pathname) || nextUrl.pathname.includes("/api")) {
			return (undefined);
		}

		// If the local is specified in the url
		const urlLocale = url.pathname.split("/")[1];
		if (urlLocale) {
			// if it's a supported language dont do anything
			if (LOCALES.includes(urlLocale)) {
				return (undefined);
			}

			// But if it's a wrong language we redirect to the url with the default language
			url.pathname = url.pathname.replace(`/${urlLocale}`, "/en");
			return (NextResponse.redirect(url));
		}

		// get client language, en is not specified in the url
		const language = headers .get("accept-language")
			?.split(",")?.[0]
			.split("-")?.[0]
			.toLowerCase() || "en";

		// if language is supported we redirect to the url with the language
		if (LOCALES.includes(language)) {
			// If it's the default language we rewrite the url to see the en page
			if (language === "en") {
				url.pathname = `/en${url.pathname}`;
				return (NextResponse.rewrite(url));
			}
			// Otherwise we redirect to the url with the language
			url.pathname = `/${language}${url.pathname}`;
			return (NextResponse.redirect(url));
		}

		return (undefined);
	} catch (error) {
		console.log(error);
	}
}