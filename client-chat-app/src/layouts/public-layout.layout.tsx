import { Loader } from 'lucide-react'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
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
