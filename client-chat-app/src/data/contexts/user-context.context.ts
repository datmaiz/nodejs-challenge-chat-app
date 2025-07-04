import type { UserWithoutPassword } from '@/types'
import { createContext } from 'react'

type UserContextData = {
	isFirstLoad: boolean
	isLoggedIn: boolean
	setIsLoggedIn: (isLoggedIn: boolean) => void
	user: UserWithoutPassword
	setUser: (user: UserWithoutPassword) => void
	accessToken: string
	setAccessToken: (accessToken: string) => void
	logout: () => void
}

export const UserContext = createContext<UserContextData>({
	isFirstLoad: true,
	isLoggedIn: false,
	setIsLoggedIn: () => {},
	user: {} as UserWithoutPassword,
	setUser: () => {},
	accessToken: '',
	setAccessToken: () => {},
	logout: () => {},
})
