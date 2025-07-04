import type { MessageWithUser, UserWithoutPassword } from '@/types'
import clsx from 'clsx'

type MessageCardProps = {
	message: MessageWithUser
	currentUser: UserWithoutPassword
	selectedUser: UserWithoutPassword
}

export function MessageCard({ message, currentUser, selectedUser }: MessageCardProps) {
	const isSelf = message.sender._id === currentUser._id

	return (
		<div
			key={message._id}
			className={clsx(
				'w-fit max-w-[70%] px-4 py-2 rounded-xl text-sm shadow-sm whitespace-pre-wrap',
				isSelf
					? 'ml-auto bg-slate-800 text-white rounded-br-none'
					: 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
			)}
		>
			<p className='mb-1 font-medium'>{isSelf ? 'You' : selectedUser.name}</p>
			<p>{message.message}</p>
			<p className='mt-1 text-xs text-slate-400 text-right'>
				{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
			</p>
		</div>
	)
}
