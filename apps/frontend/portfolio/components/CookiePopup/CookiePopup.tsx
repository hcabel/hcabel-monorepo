"use client";

import Image from "next/image";

// Design
import Style from "./CookiePopup.module.scss";
import CookiesBackground from "Images/CookiesBackground.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CookieManager from "Utils/CookieManager";

export default function CookiePopup() {
	// Show cookie popup if the cookie has never been setted before
	const [_ShowCookiePopup, set_ShowCookiePopup] = useState<boolean>(false);

	useEffect(() => {
		if (!Cookies.get("AllowCookies")) {
			set_ShowCookiePopup(true);
		}
	}, []);

	// If the user accept the cookies, set the cookie and hide the popup
	function AcceptCookies() {
		// Create a cookie that remember for a year that the cookie policy was accepted
		CookieManager.setCookie("AllowCookies", "true", {
			expires: 365 /* 1 Year */,
		});
		set_ShowCookiePopup(false);
	}

	// If the user refuse the cookies, set the cookie (has session cookie) and hide the popup
	function RefuseCookies() {
		// Create a session cookie that will be delete at the end of the session
		CookieManager.setCookie("AllowCookies", "false");
		set_ShowCookiePopup(false);
	}

	// Hide popup if the user already accepted or refused the cookies
	if (_ShowCookiePopup === false) {
		return null;
	}
	return (
		<div className={Style.Popup}>
			<Image
				src={CookiesBackground}
				alt="Coookies popup background"
				className={Style.BackgroundImage}
				priority
			/>
			<h4 className={`h4 ${Style.Title}`}>🍪Cookie Policy🍪</h4>
			<div className={Style.Grid2x2}>
				<ul>
					<li>
						<b>{"Custom made"}</b>
						{",\n stored in my own database"}
					</li>
					<li>
						<b>{"Anonymous"}</b>
						{",\n I couldn't identify you even if I wanted"}
					</li>
				</ul>
				<ul>
					<li>
						<b>{"Not selled to anyone"}</b>
						{",\n I dont know how to do so anyway"}
					</li>
					<li>
						<b>{"Privacy safe"}</b>
						{",\n very little data are collected"}
					</li>
				</ul>
			</div>
			<h5 className={`${Style.Title} ${Style.GoToSource} h5`}>
				{"If you dont believe me => "}
				<Link href="https://github.com/hcabel/hcabel-monorepo">
					source code
				</Link>
			</h5>
			<div className={Style.Buttons}>
				<button onClick={RefuseCookies}>
					<h5 className={`h5 ${Style.BtnText}`}>Deny 😞</h5>
				</button>
				<button
					onClick={AcceptCookies}
					className={`${Style.PrimaryBtn}`}
				>
					<h5 className={`h5 ${Style.BtnText}`}>Allow 😊</h5>
				</button>
			</div>
		</div>
	);
}
