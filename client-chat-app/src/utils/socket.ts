import { io, Socket } from 'socket.io-client'

let socket: Socket

export const connectSocket = (token: string) => {
	if (socket) {
		socket.disconnect()
	}

	socket = io('http://localhost:3000', {
		withCredentials: true,
		auth: {
			token: token.startsWith('Bearer ') ? token.split(' ')[1] : token,
		},
		transports: ['websocket', 'polling'],
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 1000,
		autoConnect: true,
		path: '/socket.io',
	})

	return socket
}

export const getSocket = (): Socket | undefined => {
	return socket
}
