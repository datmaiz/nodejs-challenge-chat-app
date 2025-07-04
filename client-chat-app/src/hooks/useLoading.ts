import { useCallback, useState } from 'react'

export function useLoading(isLoading: boolean = false) {
	const [loading, setLoading] = useState(isLoading)

	const execute = useCallback(async <T = void>(callback: () => Promise<T>) => {
		setLoading(true)
		await callback()
		setLoading(false)
	}, [])

	return {
		loading,
		execute,
	}
}
