import { UserContext } from '@/data/contexts'
import { useContext } from 'react'

export const useUserContext = () => {
	const context = useContext(UserContext)
	return context
}
