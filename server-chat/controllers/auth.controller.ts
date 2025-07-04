import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { UserModel } from '../models'
import type { JwtPayload } from '../types'
import { ErrorResponse, SuccessResponse } from '../utils/api-response'
import { REFRESH_KEY, SALT } from '../utils/constants'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import { HttpStatusCode } from '../utils/status-code'

export const signIn = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		if (!email || !password) {
			return res
				.status(HttpStatusCode.BAD_REQUEST)
				.json(new ErrorResponse(false, 'Email or password is not exist', new Error('Email or password is not exist')))
		}

		const user = await UserModel.findOne({ email }).lean()
		if (!user) {
			return res
				.status(HttpStatusCode.NOT_FOUND)
				.json(new ErrorResponse(false, 'User not found', { email: 'Email has not been registered', password: '' }))
		}

		const isValidPassword = bcrypt.compareSync(password, user.password)
		if (!isValidPassword) {
			return res
				.status(HttpStatusCode.UNAUTHORIZED)
				.json(new ErrorResponse(false, 'Invalid password', { email: '', password: 'Password is invalid' }))
		}

		const accessToken = await generateAccessToken({ sub: user._id.toString(), email: user.email })
		const refreshToken = await generateRefreshToken({ sub: user._id.toString(), email: user.email })

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true, // only https
			sameSite: 'strict',
			maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
		})

		return res.status(HttpStatusCode.OK).json(
			new SuccessResponse(true, 'Sign in successfully', {
				accessToken,
				refreshToken,
				user: { email: user.email, _id: user._id },
			})
		)
	} catch (error) {
		console.log(error)
		return res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json(new ErrorResponse(false, 'Internal Server Error', error))
	}
}

export const register = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body
		if (!name || !email || !password) {
			return res.status(HttpStatusCode.BAD_REQUEST).json(
				new ErrorResponse(false, 'Name, email or password is not exist', {
					email: 'Email is not exist',
					password: 'Password is not exist',
					name: 'Name is not exist',
				})
			)
		}

		const user = await UserModel.findOne({ email }).lean()
		if (user) {
			return res
				.status(HttpStatusCode.BAD_REQUEST)
				.json(new ErrorResponse(false, 'User already exist', { email: 'Email has been already used', password: '' }))
		}

		const hashedPassword = bcrypt.hashSync(password, SALT)

		const newUser = await UserModel.create({ email, name, password: hashedPassword })
		return res.status(HttpStatusCode.OK).json(new SuccessResponse(true, 'Register successfully', newUser))
	} catch (error) {
		console.log(error)
		return res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json(new ErrorResponse(false, 'Internal Server Error', error))
	}
}

export const refreshToken = async (req: Request, res: Response) => {
	try {
		const token = req.cookies.refreshToken
		if (!token) {
			return res
				.status(HttpStatusCode.UNAUTHORIZED)
				.json(new ErrorResponse(false, 'Refresh token is not exist', new Error('Refresh token is not exist')))
		}

		const decoded = jwt.verify(token, REFRESH_KEY!) as JwtPayload
		const newAccessToken = await generateAccessToken({ sub: decoded.sub, email: decoded.email })

		return res
			.status(HttpStatusCode.OK)
			.json(new SuccessResponse(true, 'Refresh token successfully', { accessToken: newAccessToken }))
	} catch (error) {
		console.log(error)
		return res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json(new ErrorResponse(false, 'Internal Server Error', error))
	}
}

export const logout = async (req: Request, res: Response) => {
	try {
		res.clearCookie('refreshToken')
		return res.status(HttpStatusCode.OK).json(new SuccessResponse(true, 'Logout successfully'))
	} catch (error) {
		console.log(error)
		return res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json(new ErrorResponse(false, 'Internal Server Error', error))
	}
}
