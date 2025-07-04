import { Loader, Menu, Send } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getMessageConversation, getUsers } from '@/apis/services'
import { ThreeUsers } from '@/assets'
import { MessageCard } from '@/components/commons'
import { Sidebar } from '@/components/commons/sidebar.component'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLoading, useSocket, useUserContext } from '@/hooks'
import { type MessageWithUser, type UserResponse, type UserWithoutPassword } from '@/types'
import { isSuccess } from '@/utils/api-response'
import { SOCKET_EVENTS } from '@/utils/constants'

export default function ChatPage() {
	const [messages, setMessages] = useState<MessageWithUser[]>([])
	const [input, setInput] = useState('')
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<UserWithoutPassword>()
	const [users, setUsers] = useState<UserResponse[]>([])
	const [isOpponentTyping, setIsOpponentTyping] = useState(false)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)

	const { loading: isLoadingMessage, execute: getMessages } = useLoading()
	const { socket } = useSocket()
	const scrollRef = useRef<HTMLDivElement>(null)
	const { user } = useUserContext()
	const isTyping = useMemo(() => input.length !== 0, [input])

	useEffect(() => {
		;(async () => {
			const response = await getUsers()
			if (isSuccess(response)) {
				console.log(response.data)
				setUsers(response.data || [])
			}
		})()
	}, [])

	const loadMessages = async (pageNum: number) => {
		if (!selectedUser?._id) return

		const response = await getMessageConversation({
			senderId: user._id,
			receiverId: selectedUser?._id,
			page: pageNum,
			limit: 20,
		})

		if (isSuccess(response)) {
			if (!response.data) return

			const { messages: newMessages, hasMore } = response.data
			setMessages(prev => (pageNum === 1 ? newMessages : [...newMessages, ...prev]))
			setHasMore(hasMore)
			setShouldScrollToBottom(true)
		}
	}

	useEffect(() => {
		if (selectedUser?._id) {
			setPage(1)
			setHasMore(true)
			getMessages(async () => loadMessages(1))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedUser?._id])

	useEffect(() => {
		if (shouldScrollToBottom && page === 1) {
			handleScrollToBottom()
			setShouldScrollToBottom(false)
		}
	}, [messages, shouldScrollToBottom, page])

	useEffect(() => {
		if (!socket || !selectedUser) return

		// Join room when selecting a user
		socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, {
			userId1: user._id,
			userId2: selectedUser._id,
		})

		// Listen for new messages
		socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (newMessage: MessageWithUser) => {
			if (newMessage.receiver._id !== user._id) return

			setMessages(prev => [...prev, newMessage])
			setShouldScrollToBottom(true)
		})

		return () => {
			socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, {
				userId: user._id,
				targetId: selectedUser._id,
			})
			socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE)
		}
	}, [socket, selectedUser, user._id])

	useEffect(() => {
		if (!socket || !selectedUser) return

		// Emit typing event when user types
		socket.on(SOCKET_EVENTS.USER_TYPING, ({ receiverId, senderId, isTyping }) => {
			console.log(`>>>> [TYPING]: receiver: ${receiverId}, senderId: ${senderId}, isTyping: ${isTyping}`)
			setIsOpponentTyping(isTyping)
		})
		console.log('set up typing listener')

		return () => {
			socket.off(SOCKET_EVENTS.USER_TYPING)
		}
	}, [selectedUser, socket])

	useEffect(() => {
		if (!socket || !selectedUser) return

		// Emit typing event when user types
		socket.emit(SOCKET_EVENTS.TYPING, {
			receiverId: selectedUser._id,
			isTyping,
		})
	}, [isTyping, socket, selectedUser])

	const handleTyping = () => {
		if (!socket || !selectedUser) return
	}

	const handleSend = async () => {
		if (!input.trim() || !selectedUser || !socket) return

		const newMsg: MessageWithUser = {
			_id: Date.now().toString(),
			sender: user,
			receiver: selectedUser,
			message: input,
			timestamp: new Date().toISOString(),
		}

		// Emit message through socket
		socket.emit(SOCKET_EVENTS.SEND_MESSAGE, newMsg)

		setMessages(prev => [...prev, newMsg])
		setInput('')
	}

	const handleScrollToBottom = () => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
		const { scrollTop } = e.currentTarget
		if (scrollTop === 0 && hasMore && !isLoadingMore) {
			setIsLoadingMore(true)
			await loadMessages(page + 1)
			setPage(prev => prev + 1)
			setIsLoadingMore(false)
		}
	}

	const filteredMessages = selectedUser
		? messages.filter(
				msg =>
					(msg.sender._id === user._id && msg.receiver._id === selectedUser._id) ||
					(msg.sender._id === selectedUser._id && msg.receiver._id === user._id)
		  )
		: messages

	return (
		<div className='flex h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 relative overflow-hidden'>
			{/* === Sidebar === */}
			<Sidebar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				currentUser={user}
				selectedUser={selectedUser}
				setSelectedUser={setSelectedUser}
				allUsers={users}
			/>

			{/* === Chat Area === */}
			{selectedUser ? (
				<main className='flex-1 flex flex-col max-h-dvh h-full overflow-y-auto'>
					{/* Header */}
					<header className='px-6 py-4 border-b border-slate-200 bg-white/90 backdrop-blur-md flex items-center justify-between shadow-sm'>
						<div className='flex items-center gap-3'>
							<Button
								variant='ghost'
								size='icon'
								className='md:hidden'
								onClick={() => setSidebarOpen(true)}
							>
								<Menu className='w-5 h-5' />
							</Button>
							<div>
								<p className='font-semibold text-slate-800'>Chat with {selectedUser.name}</p>
								<p className='text-xs text-slate-500'>{selectedUser.email}</p>
							</div>
						</div>
						<p className='text-sm text-slate-500'>
							{new Date().toLocaleDateString('en-US', {
								weekday: 'short',
								month: 'short',
								day: 'numeric',
							})}
						</p>
					</header>

					{/* Messages */}
					<div
						className='flex-1 overflow-y-auto p-6 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
						onScroll={handleScroll}
					>
						{isLoadingMore && (
							<div className='text-center w-full flex items-center justify-center text-slate-500 mb-4'>
								<Loader className='animate-spin' />
							</div>
						)}
						{filteredMessages.map(msg => (
							<MessageCard
								key={msg._id}
								message={msg}
								selectedUser={selectedUser}
								currentUser={user}
							/>
						))}
						<div ref={scrollRef} />
						{isLoadingMessage && (
							<div className='text-center w-full h-full flex items-center justify-center text-slate-500 mt-4'>
								<Loader className='animate-spin' />
							</div>
						)}
					</div>

					{/* Input */}
					{isOpponentTyping && <p className='text-xs text-slate-500 italic pl-2'>{selectedUser?.name} is typing...</p>}
					<form
						onSubmit={e => {
							e.preventDefault()
							handleSend()
						}}
						className='px-6 py-4 border-t border-slate-200 bg-white/90 backdrop-blur-md'
					>
						<div className='flex gap-2 items-center'>
							<Input
								placeholder={`Message ${selectedUser.name}...`}
								value={input}
								onChange={e => setInput(e.target.value)}
								onKeyDown={handleTyping}
								className='flex-1'
							/>
							<Button
								type='submit'
								className='bg-slate-700 hover:bg-slate-800 text-white'
							>
								<Send className='w-4 h-4' />
							</Button>
						</div>
					</form>
				</main>
			) : (
				<main className='flex-1 flex flex-col items-center justify-center w-full max-h-full h-full overflow-y-auto bg-white'>
					<img
						src={ThreeUsers}
						alt='No User Image'
						className='w-full h-[70%] object-contain'
					/>
					<span className='text-3xl font-bold mt-4'>No Selected User</span>
				</main>
			)}
		</div>
	)
}
