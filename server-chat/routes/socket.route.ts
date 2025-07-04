// routes/socket.route.ts
import express, { Request, Response } from 'express'
import { onlineUsers } from '../controllers'
import { verifyToken } from '../middlewares'

const socketRouter = express.Router()

// Interface cho authenticated request
interface AuthenticatedRequest extends Request {
	user: {
		id: string
		email: string
		name?: string
	}
}

// Interface cho API responses
interface OnlineUsersResponse {
	success: boolean
	data: {
		users: string[]
		count: number
	}
}

interface HealthCheckResponse {
	success: boolean
	data: {
		message: string
		onlineUsers: string[]
		totalConnections: number
		timestamp: string
	}
}

interface ErrorResponse {
	success: false
	message: string
	error?: string
}

// Get online users
socketRouter.get(
	'/online-users',
	async (req, res, next) => {
		await verifyToken(req, res, next)
	},
	(req: Request, res: Response) => {
		try {
			const onlineUsersList = Array.from(onlineUsers.keys())
			const response: OnlineUsersResponse = {
				success: true,
				data: {
					users: onlineUsersList,
					count: onlineUsersList.length,
				},
			}
			res.json(response)
		} catch (error: any) {
			console.error('Error getting online users:', error)
			const errorResponse: ErrorResponse = {
				success: false,
				message: 'Failed to get online users',
				error: error.message,
			}
			res.status(500).json(errorResponse)
		}
	}
)

// Socket health check
socketRouter.get(
	'/health',
	async (req, res, next) => {
		await verifyToken(req, res, next)
	},
	(req: Request, res: Response) => {
		try {
			const response: HealthCheckResponse = {
				success: true,
				data: {
					message: 'Socket server is running',
					onlineUsers: Array.from(onlineUsers.keys()),
					totalConnections: onlineUsers.size,
					timestamp: new Date().toISOString(),
				},
			}
			res.json(response)
		} catch (error: any) {
			console.error('Error in socket health check:', error)
			const errorResponse: ErrorResponse = {
				success: false,
				message: 'Socket health check failed',
				error: error.message,
			}
			res.status(500).json(errorResponse)
		}
	}
)

// Get user's online status
socketRouter.get(
	'/user-status/:userId',
	async (req, res, next) => {
		await verifyToken(req, res, next)
	},
	(req: Request, res: Response) => {
		try {
			const { userId } = req.params
			const isOnline = onlineUsers.has(userId)

			res.json({
				success: true,
				data: {
					userId,
					isOnline,
					lastSeen: isOnline ? new Date().toISOString() : null,
				},
			})
		} catch (error: any) {
			console.error('Error getting user status:', error)
			const errorResponse: ErrorResponse = {
				success: false,
				message: 'Failed to get user status',
				error: error.message,
			}
			res.status(500).json(errorResponse)
		}
	}
)

export { socketRouter }

export type { AuthenticatedRequest, OnlineUsersResponse, HealthCheckResponse, ErrorResponse }
