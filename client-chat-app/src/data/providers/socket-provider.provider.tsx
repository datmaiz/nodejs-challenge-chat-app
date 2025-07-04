import { connectSocket, getSocket } from '@/utils/socket'
import { useEffect, useState } from 'react'
import { SocketContext } from '../contexts'
import { refreshToken } from '@/apis/services'
import { isSuccess } from '@/utils/api-response'
import { useUserContext } from '@/hooks'
import { SOCKET_EVENTS } from '@/utils/constants'

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState(getSocket())
	const { setAccessToken, user } = useUserContext()

	useEffect(() => {
		const token = localStorage.getItem('accessToken')
		if (!token) return

		const newSocket = connectSocket(token)
		setSocket(newSocket)

		newSocket.on('connect', () => {
			console.log('Socket connected successfully:', newSocket.id)
			// Authenticate after connection
			newSocket.emit('authenticate', { token })
			newSocket.emit(SOCKET_EVENTS.CONNECT, user._id) // Emit do-connect with socket ID
		})

		newSocket.on('authenticated', () => {
			console.log('Socket authenticated successfully')
		})

		newSocket.on('unauthorized', error => {
			console.error('Socket authentication failed:', error)
			newSocket.disconnect()
		})

		newSocket.on('connect_error', error => {
			console.error('Socket connection error:', error)
			// Retry connection with new token if available
			const currentToken = localStorage.getItem('accessToken')
			if (currentToken && currentToken !== token) {
				newSocket.auth = { token: currentToken }
				newSocket.connect()
			}
		})

		newSocket.on('disconnect', reason => {
			console.log('Socket disconnected:', reason)
			if (reason === 'io server disconnect') {
				// Reconnect manually if server disconnected
				newSocket.connect()
			}
		})

		return () => {
			if (newSocket) {
				newSocket.off('connect')
				newSocket.off('authenticated')
				newSocket.off('unauthorized')
				newSocket.off('connect_error')
				newSocket.off('disconnect')
				newSocket.disconnect()
			}
		}
	}, [user._id])

	useEffect(() => {
		const interval = setInterval(() => {
			;(async () => {
				// console.log('run')
				const token = localStorage.getItem('accessToken')
				if (!token) return

				const { exp } = JSON.parse(atob(token.split('.')[1]))
				const remaining = exp * 1000 - Date.now()

				if (remaining < 10000) {
					// console.log('CAL')
					const response = await refreshToken()
					if (isSuccess(response)) {
						// console.log('New Token ', response.data?.accessToken)
						localStorage.setItem('accessToken', response.data?.accessToken || token)
						setAccessToken(response.data?.accessToken || token)
					}
				}
			})()
		}, 5 * 1000)

		return () => {
			clearInterval(interval)
		}
	}, [setAccessToken])

	return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}
