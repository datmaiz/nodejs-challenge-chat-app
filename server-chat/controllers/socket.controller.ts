import { Server, Socket } from 'socket.io'
import { AuthenticatedSocket } from '../server'
import { MessageModel } from '../models'
import { SOCKET_EVENTS } from '../utils/constants'
import { TUser } from '../types'

// Store cho users online
const onlineUsers = new Map<string, string>() // Map<userId, socketId>
const socketUsers = new Map<string, string>() // Map<socketId, userId>

// Socket event interfaces
interface SendMessageData {
	_id: string
	sender: TUser & { _id: string }
	receiver: TUser & { _id: string }
	message: string
	timestamp: string
}

interface TypingData {
	receiverId: string
	isTyping: boolean
}

interface ConversationData {
	userId1: string
	userId2: string
}

interface MessageResponse {
	id: string
	sender: TUser & { _id: string }
	receiver: TUser & { _id: string }
	message: string
	timestamp: string
	senderName: string
}

interface OnlineUsersResponse {
	users: string[]
	count: number
}

interface TypingResponse {
	userId: string
	userName: string
	isTyping: boolean
}

interface ErrorResponse {
	message: string
	code?: string
	context?: string
}

export const setupSocketHandlers = (io: Server): void => {
	io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
		const authSocket = socket as AuthenticatedSocket
		console.log(`>>>> [CONNECTION]: User ${authSocket.userId} connected with socket ${authSocket.id}`)

		authSocket.on(SOCKET_EVENTS.CONNECT, userId => {
			console.log('>>>> [CONNECT]: Connect with userId: ', userId)
			authSocket.join(`user_${userId}`)
			// Thêm user vào danh sách online

			onlineUsers.set(userId, authSocket.id)
			console.log(onlineUsers)
			socketUsers.set(authSocket.id, userId)
			broadcastOnlineUsers(io)

			// Xử lý disconnect
			authSocket.on(SOCKET_EVENTS.DISCONNECT, () => {
				console.log(`>>>> [DISCONNECT]: User ${authSocket.userId} disconnected`)

				// Xóa user khỏi danh sách online
				onlineUsers.delete(authSocket.userId)
				socketUsers.delete(authSocket.id)

				// Broadcast danh sách users online mới
				broadcastOnlineUsers(io)
			})

			// Xử lý lấy người dùng online
			authSocket.on(SOCKET_EVENTS.GET_ONLINE_USERS, () => {
				const onlineUsersList = Array.from(onlineUsers.keys())
				console.log(`>>>> [GET ONLINE USER]: ${onlineUsersList}`)
				const response: OnlineUsersResponse = {
					users: onlineUsersList,
					count: onlineUsersList.length,
				}
				io.emit(SOCKET_EVENTS.UPDATE_ONLINE_USERS, response)
			})

			// Xử lý gửi tin nhắn
			authSocket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: SendMessageData) => {
				console.log(`>>>> [SEND MESSAGE: ${JSON.stringify(data)}`)
				try {
					const { message, receiver, sender, timestamp } = data

					// Gửi tin nhắn cho người nhận (nếu họ online)
					const receiverSocketId = onlineUsers.get(receiver._id)
					if (receiverSocketId) {
						io.to(receiverSocketId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, data)
					}

					// Gửi lại cho người gửi để confirm
					// authSocket.emit(SOCKET_EVENTS.RECEIVE_MESSAGE, data)

					// Lưu tin nhắn với người gửi với người nhận
					// await MessageModel.create({
					// 	message: message.trim(),
					// 	sender: sender._id,
					// 	receiver: receiver._id,
					// 	timestamp: timestamp,
					// })
				} catch (error: any) {
					console.error('Error handling send_message:', error)
					authSocket.emit(SOCKET_EVENTS.ERROR, {
						message: 'Failed to send message',
						code: 'SEND_MESSAGE_ERROR',
					} as ErrorResponse)
				}
			})

			// Xử lý typing indicator
			authSocket.on(SOCKET_EVENTS.TYPING, (data: TypingData) => {
				try {
					const { receiverId, isTyping } = data
					const receiverSocketId = onlineUsers.get(receiverId)
					console.log(
						'>>>> [TYPING]',
						`receiverId: ${receiverId}, isTyping: ${isTyping}`,
						`receiverSocketId: ${receiverSocketId}`
					)

					if (receiverSocketId) {
						const typingResponse = {
							senderId: userId,
							receiverId,
							isTyping,
						}
						io.to(receiverSocketId).emit(SOCKET_EVENTS.USER_TYPING, typingResponse)
					}
				} catch (error: any) {
					console.error('Error handling typing:', error)
				}
			})

			// Xử lý join conversation
			// authSocket.on(SOCKET_EVENTS.JOIN_CONVERSATION, (data: ConversationData) => {
			// 	try {
			// 		const { userId1, userId2 } = data
			// 		const roomName = createConversationRoom(userId1, userId2)
			// 		authSocket.join(roomName)
			// 		console.log(`User ${authSocket.userId} joined conversation room: ${roomName}`)
			// 	} catch (error: any) {
			// 		console.error('Error joining conversation:', error)
			// 	}
			// })

			// // Xử lý leave conversation
			// authSocket.on(SOCKET_EVENTS.LEAVE_CONVERSATION, (data: ConversationData) => {
			// 	try {
			// 		const { userId1, userId2 } = data
			// 		const roomName = createConversationRoom(userId1, userId2)
			// 		authSocket.leave(roomName)
			// 		console.log(`User ${authSocket.userId} left conversation room: ${roomName}`)
			// 	} catch (error: any) {
			// 		console.error('Error leaving conversation:', error)
			// 	}
			// })

			// Xử lý error
			authSocket.on(SOCKET_EVENTS.ERROR, (error: Error) => {
				console.error('Socket error:', error)
			})
		})
	})
}

// Helper functions
const broadcastOnlineUsers = (io: Server): void => {
	const onlineUsersList = Array.from(onlineUsers.keys())
	console.log(`>>>> [BROADCAST]: ${onlineUsersList}`)
	const response: OnlineUsersResponse = {
		users: onlineUsersList,
		count: onlineUsersList.length,
	}
	io.emit(SOCKET_EVENTS.UPDATE_ONLINE_USERS, response)
	console.log(`Broadcasting ${onlineUsersList.length} online users`)
}

const createConversationRoom = (userId1: string, userId2: string): string => {
	const sortedIds = [userId1, userId2].sort()
	return `conversation_${sortedIds[0]}_${sortedIds[1]}`
}

const validateMessageData = (data: SendMessageData): { valid: boolean; error?: string } => {
	if (!data || typeof data !== 'object') {
		return { valid: false, error: 'Invalid message data format' }
	}

	const { message } = data

	if (message.trim().length > 1000) {
		return { valid: false, error: 'Message too long (max 1000 characters)' }
	}

	return { valid: true }
}

// Export cho sử dụng ở nơi khác
export { onlineUsers, socketUsers }
export type {
	ConversationData,
	ErrorResponse,
	MessageResponse,
	OnlineUsersResponse,
	SendMessageData,
	TypingData,
	TypingResponse,
}
