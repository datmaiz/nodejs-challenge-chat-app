import { useUserContext } from '@/hooks'
import { Loader } from 'lucide-react'
import { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedLayout() {
	const { isFirstLoad, isLoggedIn } = useUserContext()

	console.log('ProtectedLayout rendered', location.pathname)

	if (isFirstLoad) {
		return (
			<div className='h-dvh w-full flex flex-col items-center justify-center'>
				<Loader
					size={40}
					className='animate-spin'
				/>
				<span className='text-2xl mt-4'>Authenticating...</span>
			</div>
		)
	}

	if (!isLoggedIn) {
		return (
			<Navigate
				to={`/auth/sign-in`}
				replace
			/>
		)
	}

	return (
		<Suspense
			fallback={
				<div className='absolute inset-0 flex items-center justify-center'>
					<Loader
						size={35}
						className='animate-spin'
					/>
				</div>
			}
		>
			<Outlet />
		</Suspense>
	)
}
