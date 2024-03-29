import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./HeaderCSS.css";

import HugoMeetLogo from "./assets/HugoMeetLogo.png";

export default function Header() {
	const [_Date, set_Date] = useState(new Date());
	const navigate = useNavigate();

	function goToTheLandingPage() {
		if (window.location.pathname !== "/") {
			navigate("/");
		}
	}

	useEffect(() => {
		// First we refresh after X milliseconds remaining in the current minute
		// Then we refresh each minutes
		if (window.clockTimeout !== undefined) {
			clearTimeout(window.clockTimeout);
			window.clockTimeout = undefined;
			return;
		}

		window.clockTimeout = setTimeout(() => {
			set_Date(new Date());

			if (window.clockInterval !== undefined) {
				clearInterval(window.clockInterval);
				window.clockInterval = undefined;
				return;
			}
			window.clockInterval = setInterval(() => {
				set_Date(new Date());
			}, 60000);
		}, 60000 - _Date.getSeconds() * 1000 + _Date.getMilliseconds());
	}, [false]);

	function getHours(date) {
		const minutes = date.getMinutes();
		return `${date.getHours()}:${minutes < 10 ? "0" : ""}${minutes}`;
	}
	const hours = getHours(_Date);

	function getDate(date) {
		const dayLetter = ["Sun", "Mon", "Thu", "Wed", "Thu", "Fri", "Sat"];
		const monthLetter = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		return `${dayLetter[date.getDay()]}, ${date.getDate()} ${
			monthLetter[date.getMonth()]
		}`;
	}
	const date = getDate(_Date);

	return (
		<header className="Header">
			<div className="H-Logo" onClick={goToTheLandingPage}>
				<img
					className="H-L-Logo"
					src={HugoMeetLogo}
					alt="HugoMeet logo"
				/>
				<span className="H-L-Hugo">Hugo</span>
				<span className="H-L-Meet">Meet</span>
			</div>
			<div className="H-Date">
				<span>{hours}</span>
				<span> • </span>
				<span>{date}</span>
			</div>
		</header>
	);
}
