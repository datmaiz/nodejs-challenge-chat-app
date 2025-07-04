import type { Request, RequestHandler, Response } from 'express'

import { HttpStatusCode } from '../utils/status-code'
import { ErrorResponse, SuccessResponse } from '../utils/api-response'
import { MessageModel } from '../models'

export const getMessages = async (req: Request, res: Response) => {
	try {
		const users = await MessageModel.find()
		return res.status(HttpStatusCode.OK).json(new SuccessResponse(true, 'Get messages successfully', users))
	} catch (error) {
		console.log(error)
		return res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json(new ErrorResponse(false, 'Internal Server Error', error))
	}
}

export const getMessageChat = async (req: Request, res: Response) => {
	try {
		const { senderId, receiverId, page = 1, limit = 20 } = req.query
		if (!senderId || !receiverId) {
			return res
				.status(HttpStatusCode.BAD_REQUEST)
				.json(new ErrorResponse(false, 'Sender id or Receiver id is not exist'))
		}

		const skip = (Number(page) - 1) * Number(limit)

		const messages = await MessageModel.find({
			$or: [
				{ sender: senderId, receiver: receiverId },
				{ sender: receiverId, receiver: senderId },
			],
		})
			.populate('sender receiver')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(Number(limit))

		const totalMessages = await MessageModel.countDocuments({
			$or: [
				{ sender: senderId, receiver: receiverId },
				{ sender: receiverId, receiver: senderId },
			],
		})

		return res.status(HttpStatusCode.OK).json(
			new SuccessResponse(true, 'Get messages successfully', {
				messages: messages.reverse(),
				hasMore: totalMessages > skip + messages.length,
			})
		)
	} catch (error) {
		console.log(error)
		return res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json(new ErrorResponse(false, 'Internal Server Error', error))
	}
}

export const createMessage = async (req: Request, res: Response) => {
	try {
		const { sender, receiver, message } = req.body
		if (!sender || !receiver || !message) {
			return res
				.status(HttpStatusCode.BAD_REQUEST)
				.json(
					new ErrorResponse(
						false,
						'Sender id or Receiver id is not exist',
						new Error('Sender id or Receiver id is not exist')
					)
				)
		}

		const newMessage = await MessageModel.create({ sender, receiver, message, timestamp: new Date().toISOString() })
		return res.status(HttpStatusCode.OK).json(new SuccessResponse(true, 'Get messages successfully', newMessage))
	} catch (error) {
		console.log(error)
		return res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json(new ErrorResponse(false, 'Internal Server Error', error))
	}
}
