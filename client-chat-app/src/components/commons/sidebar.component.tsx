import clsx from 'clsx'
import { Circle, LogOut, X } from 'lucide-react'

import { logout } from '@/apis/services'
import { useGlobalPopup, useSocket, useUserContext } from '@/hooks'
import type { MessageWithUser, UpdateOnlineUsersResponse, UserWithoutPassword } from '@/types'
import { isSuccess } from '@/utils/api-response'
import { toast } from 'react-toastify'
import { Button } from '../ui'
import { useEffect, useState } from 'react'
import { SOCKET_EVENTS } from '@/utils/constants'
import { GlobalPopup } from './global-popup.component'

type SidebarProps = {
	sidebarOpen: boolean
	setSidebarOpen: (open: boolean) => void
	setSelectedUser: (user: UserWithoutPassword) => void
	allUsers: UserWithoutPassword[]
	currentUser: UserWithoutPassword
	selectedUser?: UserWithoutPassword
}

export function Sidebar({
	sidebarOpen,
	setSidebarOpen,
	allUsers,
	currentUser,
	selectedUser,
	setSelectedUser,
}: SidebarProps) {
	const { logout: userLogout } = useUserContext()
	const { socket } = useSocket()
	const { popupState, confirm, hidePopup } = useGlobalPopup()

	const [onlineUsers, setOnlineUsers] = useState<string[]>([])

	useEffect(() => {
		if (!socket) return

		socket.emit(SOCKET_EVENTS.GET_ONLINE_USERS)

		// Listen for update online users
		socket.on(SOCKET_EVENTS.UPDATE_ONLINE_USERS, (onlineUsers: UpdateOnlineUsersResponse) => {
			setOnlineUsers(onlineUsers.users)
			console.log('>>>> [UPDATE_ONLINE_USERS]:', onlineUsers.users)
		})

		// Listen for new messages
		socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (newMessage: MessageWithUser) => {
			console.log(`New message received! ${newMessage._id}`)
		})

		return () => {
			socket.off(SOCKET_EVENTS.UPDATE_ONLINE_USERS)
			socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE)
		}
	}, [socket])

	const handleLogout = async () => {
		confirm('Logout Confirmation', 'Are you sure you want to log out?', async () => {
			const response = await logout()
			if (isSuccess(response)) {
				userLogout()
				return
			}

			toast.error(response.message || 'Logout failed')
		})
	}

	const handleUserClick = (user: UserWithoutPassword) => {
		setSelectedUser(user)
		setSidebarOpen(false)
	}

	return (
		<div
			className={clsx(
				'w-64 border-r border-slate-200 bg-white/90 backdrop-blur-md p-4 absolute md:relative z-30 transition-transform duration-300 h-full flex flex-col',
				sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
			)}
		>
			<GlobalPopup
				{...popupState.config}
				isOpen={popupState.isOpen}
				onClose={hidePopup}
			/>
			<div className='flex items-center justify-between mb-4 bod md:hidden'>
				<h2 className='text-lg font-semibold text-slate-800'>Online Users</h2>
				<Button
					variant='default'
					size='icon'
					onClick={() => setSidebarOpen(false)}
				>
					<X className='w-4 h-4' />
				</Button>
			</div>

			<h2 className='text-lg font-semibold mb-4 hidden md:block text-slate-800 border-b pb-4'>Available Users</h2>

			<ul className='space-y-2 flex-1'>
				{allUsers
					.filter(u => u._id !== currentUser._id)
					.map(user => (
						<li
							key={user._id}
							onClick={() => handleUserClick(user)}
							className={clsx(
								'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200',
								selectedUser?._id === user._id ? 'bg-slate-100 border border-slate-300 shadow-sm' : 'hover:bg-slate-100'
							)}
						>
							<Circle
								className={`w-3 h-3 ${
									onlineUsers.includes(user._id) ? 'text-green-500 fill-green-500' : 'text-gray-500 fill-gray-500'
								} `}
							/>
							<div>
								<p className='text-sm font-medium text-slate-800'>{user.name}</p>
								<p className='text-xs text-slate-500'>{user.email}</p>
							</div>
						</li>
					))}
			</ul>

			<div className='mt-auto'>
				<Button
					variant={'ghost'}
					className='w-full justify-start'
					onClick={handleLogout}
				>
					<LogOut />
					<span className='ml-2'>Sign out</span>
				</Button>
			</div>
		</div>
	)
}
