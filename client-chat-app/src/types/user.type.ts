export type User = {
	_id: string
	name: string
	email: string
	password: string
}

export type UserResponse = {
	_id: string
	name: string
	email: string
	password: string
}

export type UserWithoutPassword = Omit<User, 'password'>

export type UserCreation = Omit<User, '_id'>
