import type { UserWithoutPassword } from './user.type'

export type Message = {
	_id: string
	sender: string
	receiver: string
	message: string
	timestamp: string
}

export type MessageCreation = {
	sender: string
	receiver: string
	message: string
}

export type MessageWithUser = Omit<Message, 'sender' | 'receiver'> & {
	sender: UserWithoutPassword
	receiver: UserWithoutPassword
}
