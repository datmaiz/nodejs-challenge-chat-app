import type { User } from './user.type'

export type SignInPayload = {
	email: string
	password: string
}

export type SignInResponse = {
	accessToken: string
	refreshToken: string
	user: Omit<User, 'password'>
}

export type RegisterPayload = {
	name: string
	email: string
	password: string
}
