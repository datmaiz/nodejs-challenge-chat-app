import jwt from 'jsonwebtoken'
import { ACCESS_KEY, REFRESH_KEY } from './constants'
import type { JwtPayload } from '../types'

export const generateAccessToken = async (data: JwtPayload) => {
	try {
		const accessToken = jwt.sign(data, ACCESS_KEY!, {
			expiresIn: '120s',
		})
		return accessToken
	} catch (error) {
		console.log(error)
	}
}

export const generateRefreshToken = async (data: JwtPayload) => {
	try {
		const refreshToken = jwt.sign(data, REFRESH_KEY!, {
			expiresIn: '1d',
		})
		return refreshToken
	} catch (error) {
		console.log(error)
	}
}
