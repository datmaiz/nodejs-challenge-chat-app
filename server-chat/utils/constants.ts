import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 8080
export const HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost'

export const MONGOOSE_URI = process.env.MONGOOSE_URI

export const TEST = process.env.NODE_ENV === 'test'

export const SALT = 10
export const ACCESS_KEY = process.env.JWT_ACCESS_KEY
export const REFRESH_KEY = process.env.JWT_REFRESH_KEY
export const CLIENT_URL = process.env.CLIENT_URL

export const SOCKET_EVENTS = {
	CONNECTION: 'connection',
	DISCONNECT: 'disconnect',
	CONNECT: 'do-connect',
	UPDATE_ONLINE_USERS: 'online_users_updated',
	GET_ONLINE_USERS: 'get_online_users',
	SEND_MESSAGE: 'send_message',
	RECEIVE_MESSAGE: 'receive_message',
	MESSAGE_SENT: 'message_sent',
	ERROR: 'error',
	TYPING: 'typing',
	USER_TYPING: 'user_typing',
	JOIN_CONVERSATION: 'join_conversation',
	LEAVE_CONVERSATION: 'leave_conversation',
}
