import type { Request, RequestHandler, Response } from 'express'

import { HttpStatusCode } from '../utils/status-code'
import { ErrorResponse, SuccessResponse } from '../utils/api-response'
import { UserModel } from '../models'

export const getUsers = async (req: Request, res: Response) => {
	try {
		const sub = (req as any).sub
		console.log(sub)
		const users = await UserModel.find()
		return res.status(HttpStatusCode.OK).json(new SuccessResponse(true, 'Get users successfully', users))
	} catch (error) {
		console.log(error)
		return res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json(new ErrorResponse(false, 'Internal Server Error', error))
	}
}

export const getUserByEmail = async (req: Request, res: Response) => {
	try {
		const { email } = req.params
		if (!email) {
			return res
				.status(HttpStatusCode.BAD_REQUEST)
				.json(new ErrorResponse(false, 'Email is not exist', new Error('Email is not exist')))
		}

		const user = await UserModel.findOne({ email }).lean()

		if (!user) {
			return res
				.status(HttpStatusCode.NOT_FOUND)
				.json(new ErrorResponse(false, 'User not found', new Error('User not found')))
		}

		return res.status(HttpStatusCode.OK).json(new SuccessResponse(true, 'Get user successfully', user))
	} catch (error) {
		console.log(error)
		return res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json(new ErrorResponse(false, 'Internal Server Error', error))
	}
}

export const getUserById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) {
			return res
				.status(HttpStatusCode.BAD_REQUEST)
				.json(new ErrorResponse(false, 'User id is not exist', new Error('User id is not exist')))
		}

		const user = await UserModel.findById(id).lean()
		if (!user) {
			return res
				.status(HttpStatusCode.NOT_FOUND)
				.json(new ErrorResponse(false, 'User not found', new Error('User not found')))
		}

		return res.status(HttpStatusCode.OK).json(new SuccessResponse(true, 'Get user successfully', user))
	} catch (error) {
		console.log(error)
		return res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json(new ErrorResponse(false, 'Internal Server Error', error))
	}
}
