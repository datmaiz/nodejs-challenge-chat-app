import { type UserWithoutPassword, type TContainer } from '@/types'
import { UserContext } from '../contexts'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function UserProvider({ children }: TContainer) {
	const navigate = useNavigate()

	const [isFirstLoad, setIsFirstLoad] = useState(true)
	const [user, setUser] = useState<UserWithoutPassword>({ _id: '', name: '', email: '' })
	const [accessToken, setAccessToken] = useState('')
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken')
		const userInfo = localStorage.getItem('user-info')
		if (userInfo) {
			setIsLoggedIn(true)
			setUser(JSON.parse(userInfo))
		} else {
			setIsLoggedIn(false)
		}

		if (accessToken) {
			setAccessToken(accessToken)
		}

		setIsFirstLoad(false)
	}, [])

	const logout = () => {
		localStorage.removeItem('accessToken')
		localStorage.removeItem('user-info')
		setUser({ _id: '', name: '', email: '' })
		setAccessToken('')
		setIsLoggedIn(false)
		navigate('/auth/sign-in', { replace: true })
	}

	return (
		<UserContext.Provider
			value={{ isFirstLoad, user, setUser, accessToken, setAccessToken, isLoggedIn, setIsLoggedIn, logout }}
		>
			{children}
		</UserContext.Provider>
	)
}
