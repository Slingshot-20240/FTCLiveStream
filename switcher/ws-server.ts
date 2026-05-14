// simple websocket server for testing - broadcasts messages to all clients
// @ts-nocheck
const server = Bun.serve({
	port: 8080,
	fetch(req, server) {
		if (server.upgrade(req)) return;
		return new Response('WebSocket server running on port 8080');
	},
	websocket: {
		open(ws) {
			console.log('Client connected');
			ws.subscribe('switcher');
		},
		message(ws, message) {
			console.log('Received:', message);
			// broadcast to all clients including sender
			server.publish('switcher', message);
		},
		close(ws) {
			console.log('Client disconnected');
		}
	}
});

console.log(`WebSocket server running on ws://localhost:${server.port}`);
