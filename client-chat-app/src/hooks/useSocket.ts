import { SocketContext } from '@/data/contexts'
import { useContext } from 'react'

export const useSocket = () => useContext(SocketContext)
