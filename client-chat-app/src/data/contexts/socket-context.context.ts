import { getSocket } from '@/utils/socket'
import { createContext } from 'react'

interface SocketContextProps {
	socket: ReturnType<typeof getSocket> | null
}

export const SocketContext = createContext<SocketContextProps>({
	socket: null,
})
