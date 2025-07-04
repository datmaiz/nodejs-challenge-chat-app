import type { Message, MessageCreation, MessageWithUser } from '@/types'
import { ErrorResponse, SuccessResponse } from '@/utils/api-response'
import { axiosInstance } from '@/utils/axios-instance'
import { AxiosError } from 'axios'

type MessageConversationParams = {
	senderId: string
	receiverId: string
	page?: number
	limit?: number
}

type MessageResponse = {
	messages: MessageWithUser[]
	hasMore: boolean
}

export const getMessageConversation = async (
	payload: MessageConversationParams
): Promise<SuccessResponse<MessageResponse> | ErrorResponse> => {
	try {
		const response = await axiosInstance.get('/messages', { params: payload })
		const data = response.data

		if (!data.success) {
			return new ErrorResponse(false, data.message)
		}

		return new SuccessResponse(true, data.message, data.data)
	} catch (error) {
		console.log(error)
		if (error instanceof AxiosError) {
			return new ErrorResponse(false, (error as Error).message)
		}
		return new ErrorResponse(false, (error as Error).message)
	}
}

export const createMessage = async (payload: MessageCreation): Promise<SuccessResponse<Message[]> | ErrorResponse> => {
	try {
		const response = await axiosInstance.post('/messages', payload)
		const data = response.data

		if (!data.success) {
			return new ErrorResponse(false, data.message)
		}

		return new SuccessResponse(true, data.message, data.data)
	} catch (error) {
		console.log(error)
		if (error instanceof AxiosError) {
			return new ErrorResponse(false, (error as Error).message)
		}
		return new ErrorResponse(false, (error as Error).message)
	}
}
