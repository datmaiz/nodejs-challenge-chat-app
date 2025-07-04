export const baseURL = import.meta.env.VITE_BASE_URL
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
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
