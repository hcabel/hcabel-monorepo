"use client";

import { Routes as TelemetryApiRoutes } from "@hcabel/bridges/TelemetryApi";

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
				TelemetryApiRoutes.create_visit(window.location.href);
			}
		});
	}, [pathname]);
	return <></>;
}
