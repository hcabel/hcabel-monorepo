/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   signallingServer.js                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hcabel <hcabel@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/11/19 22:48:34 by hcabel            #+#    #+#             */
/*   Updated: 2021/11/19 22:48:38 by hcabel           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require("express");
const app = express();
const port = process.env.NX_HUGOMEET_SS_ENDPOINT.match(/:[0-9]{4}/)[0].slice(1);
const http = require("http");
const server = http.createServer(app);
const ws = require("ws");

const onClientConnection = require("./wsClient");
const clientServer = new ws.Server({ server: server });
clientServer.on("connection", onClientConnection);
console.log(`WebSocket listening to Client connections on *:${port}`);

server.listen(port, () => {
	console.log(`Signalling Server: READY`);
});
