import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import { logRequest } from './middlewares'
import { messageRouter, socketRouter, userRouter } from './routes'
import { authRouter } from './routes/auth.route'

import './utils/logger'
import { ACCESS_KEY, CLIENT_URL, MONGOOSE_URI, PORT, SALT, SOCKET_EVENTS } from './utils/constants'
import { setupSocketHandlers } from './controllers'

// Extend Socket interface
interface AuthenticatedSocket extends Socket {
	userId: string
	userInfo: {
		id: string
		email: string
		name?: string
		[key: string]: any
	}
}

// JWT Payload interface
interface JWTPayload {
	id: string
	email: string
	name?: string
	iat?: number
	exp?: number
	[key: string]: any
}

const app = express()

// Middleware
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
	cors({
		credentials: true,
		origin: [CLIENT_URL || 'http://localhost:5173'],
	})
)

// app.use(logRequest)

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/messages', messageRouter)
app.use('/api/v1/socket', socketRouter)

// Connect to MongoDB and start server
mongoose
	.connect(MONGOOSE_URI!)
	.then(() => {
		console.log('Connected to MongoDB')

		const server = app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})
		const io = new Server(server, {
			cors: {
				origin: [
					'http://localhost:5173',
					'https://your-client-url.vercel.app', // Add your deployed client URL
				],
				methods: ['GET', 'POST'],
				credentials: true,
				allowedHeaders: ['authorization'],
			},
			allowEIO3: true,
			transports: ['websocket', 'polling'],
			pingTimeout: 60000,
		})

		// Enable Socket.IO Authentication Middleware
		io.use((socket: Socket, next) => {
			try {
				const token = socket.handshake.auth.token

				if (!token) {
					return next(new Error('Authentication error: No token provided'))
				}

				const decoded = jwt.verify(token, ACCESS_KEY!) as JWTPayload
				const authSocket = socket as AuthenticatedSocket
				authSocket.userId = decoded.id
				authSocket.userInfo = {
					id: decoded.sub,
					email: decoded.email,
				}

				console.log(`Socket authenticated for user:`, authSocket.userInfo)
				next()
			} catch (error: any) {
				console.error('Socket authentication error:', error.message)
				next(new Error('Authentication error: Invalid token'))
			}
		})

		// io.on(SOCKET_EVENTS.CONNECTION, socket => {
		// 	console.log('New socket connection:', socket.id)

		// 	socket.on(SOCKET_EVENTS.CONNECT, (userId: string) => {
		// 		console.log('User connected with userId:', userId)
		// 		socket.join(userId)
		// 	})

		// 	socket.on('disconnect', () => {
		// 		console.log('User disconnected:', socket.id)
		// 	})
		// })
		setupSocketHandlers(io)
	})
	.catch((err: Error) => {
		console.log(err)
	})

// Export for testing or other modules
// export { app, server, io }
export type { AuthenticatedSocket, JWTPayload }
