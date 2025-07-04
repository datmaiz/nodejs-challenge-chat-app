import { Loader, MessageCircle } from 'lucide-react'
import { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useUserContext } from '@/hooks'

export default function AuthLayout() {
	const { isFirstLoad, isLoggedIn } = useUserContext()

	console.log('AuthLayout rendered', location.pathname)

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

	if (isLoggedIn) {
		return (
			<Navigate
				to={'/chat'}
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
			<div className='min-h-dvh bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4'>
				<div className='absolute inset-0 overflow-hidden'>
					<div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-slate-400/20 to-slate-600/20 rounded-full blur-3xl' />
					<div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-500/20 to-slate-700/20 rounded-full blur-3xl' />
				</div>

				<div className='relative w-full max-w-md'>
					<div className='bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 p-8 transition-all duration-500 hover:shadow-2xl'>
						<div className='text-center mb-8'>
							<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl mb-4 shadow-lg'>
								<MessageCircle className='w-8 h-8 text-white' />
							</div>
							<h1 className='text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent'>
								Welcome to Chat App
							</h1>
							<p className='text-slate-600 mt-2'>Join to explore the community of Chat App</p>
						</div>

						<Outlet />
					</div>
				</div>
			</div>
		</Suspense>
	)
}
