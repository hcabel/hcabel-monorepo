'use client';

import CookiePopup from 'Components/CookiePopup/CookiePopup';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import CookieManager from '../utils/CookieManager';
import './global.scss';

import Head from "./head";

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children, }: RootLayoutProps) {
	// Show cookie popup if the cookie has never been setted before
	const [ _ShowCookiePopup, set_ShowCookiePopup ] = useState<boolean>(false);

	useEffect(() => {
		if (!Cookies.get("AllowCookies")) {
			set_ShowCookiePopup(true);
		}
	}, []);

	return (
		<html>
			<Head />
			<body className="root">
				{children}
				{_ShowCookiePopup &&
					<CookiePopup
						onAccept={() => {
							// Create a cookie that remember for a year that the cookie policy was accepted
							CookieManager.setCookie("AllowCookies", "true", {
								expires: 365 /* 1 Year */
							});
							set_ShowCookiePopup(false);
						}}
						onDeny={() => {
							// Create a session cookie that will be delete at the end of the session
							CookieManager.setCookie("AllowCookies", "false");
							set_ShowCookiePopup(false);
						}}
					/>
				}
			</body>
		</html>
	);
}
