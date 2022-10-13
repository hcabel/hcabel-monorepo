const express = require('express');
const port = process.argv[2] || 3000;
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);

const appName = __dirname.slice(__dirname.indexOf("/apps/") + 6);
const distPath = __dirname.replace("/apps/", "/dist/apps/");

app.use(express.static(__dirname));
app.use(express.static(distPath));

app.get('/*', function(req, res) {
	res.sendFile(path.join(distPath, 'index.html'));
});

server.listen(port, function() {
	console.log(`${appName} is running on :${port}`);
});
