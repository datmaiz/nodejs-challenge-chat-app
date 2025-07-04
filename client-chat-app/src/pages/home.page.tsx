import { MessageCircle, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { FeatureCard } from '@/components/commons'
import { Button } from '@/components/ui/button'

export default function HomePage() {
	return (
		<main className='min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-800 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden'>
			{/* Background decor */}
			<div className='absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-tr from-slate-400/20 to-slate-600/20 rounded-full blur-3xl z-0' />
			<div className='absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-slate-500/20 to-slate-700/20 rounded-full blur-3xl z-0' />

			{/* Content */}
			<section className='relative z-10 text-center max-w-2xl'>
				<div className='inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl shadow-lg'>
					<MessageCircle className='w-10 h-10 text-white' />
				</div>
				<h1 className='text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
					Connect, Chat, and Collaborate
				</h1>
				<p className='mt-4 text-lg text-slate-600'>
					Welcome to <span className='font-semibold'>ChatApp</span> – your modern and beautiful platform to chat, share,
					and stay connected with your people.
				</p>

				<div className='mt-8 flex justify-center gap-4 flex-wrap'>
					<Link to='/chat'>
						<Button className='px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white hover:from-slate-800 hover:to-slate-950 transition-all shadow-md'>
							Get Started
						</Button>
					</Link>
					<a
						href='#features'
						className='inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 transition font-medium'
					>
						Learn more
					</a>
				</div>
			</section>

			{/* Features Section */}
			<section
				id='features'
				className='relative z-10 mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4'
			>
				<FeatureCard
					icon={<Users className='w-8 h-8 text-slate-600' />}
					title='Friend Chats'
					desc='Create or join unlimited chat rooms. Stay connected with your communities.'
				/>
				<FeatureCard
					icon={<ShieldCheck className='w-8 h-8 text-slate-600' />}
					title='Privacy First'
					desc='All messages are encrypted and your data is protected. Always.'
				/>
				<FeatureCard
					icon={<MessageCircle className='w-8 h-8 text-slate-600' />}
					title='Real-Time Messaging'
					desc='Fast and responsive chatting with your friends, powered by WebSockets.'
				/>
			</section>

			{/* Footer */}
			<footer className='relative z-10 mt-32 text-sm text-slate-500 text-center'>
				© {new Date().getFullYear()} ChatApp. All rights reserved.
			</footer>
		</main>
	)
}

// Reusable FeatureCard component
