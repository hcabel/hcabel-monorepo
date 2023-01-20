/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.jsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hcabel <hcabel@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/11/19 22:49:07 by hcabel            #+#    #+#             */
/*   Updated: 2021/12/23 16:22:28 by hcabel           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import LandingPage from "./pages/landingPage/landingPage";
import RoomPage from "./pages/roomPage/roomPage";
import Utils from "./utils/utils";

export default function App() {
	const location = useLocation();

	useEffect(() => {
		console.log(location.pathname);
		// If go on a page that isn't a room page
		if (!location.pathname.startsWith("/room/")) {
			// Close signalling WebSocket
			if (window.SignalingSocket) {
				window.SignalingSocket.onopen = undefined;
				window.SignalingSocket.onmessage = undefined;
				window.SignalingSocket.onerror = undefined;
				window.SignalingSocket.onclose = undefined;
				if (
					window.SignalingSocket.readyState === 0 ||
					window.SignalingSocket.readyState === 1
				) {
					window.SignalingSocket.close();
				}
				window.SignalingSocket = null;
			}

			Utils.media.killTracks(
				window.localStream?.getTracks(),
				window.localStream
			);
		}
	}, [location]);

	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/room/:roomId" element={<RoomPage />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
