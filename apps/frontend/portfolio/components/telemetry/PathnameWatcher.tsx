"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import CookieManager from "Utils/CookieManager";

export default function PathnameWatcher() {
	const pathname = usePathname();

	useEffect(() => {
		// subscribe to AllowCookies changes
		CookieManager.onCookieChange("AllowCookies", (cookieValue) => {
			if (cookieValue === "true") {
				// Send post visit request to the telemetry server
				// This will tell that someone has visited the page
				fetch(`${process.env.NX_TELEMETRY_API_ENDPOINT}/visits`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						href: window.location.href,
					}),
				});
			}
		});
	}, [pathname]);
	return <></>;
}
