import type { NextFunction, Request, Response } from 'express'
import { HttpStatusCode } from '../utils/status-code'
import jwt from 'jsonwebtoken'

import { ErrorResponse } from '../utils/api-response'
import { ACCESS_KEY } from '../utils/constants'
import type { JwtPayload } from '../types'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization
		// console.log('>>>>> ACCESS TOKEN', JSON.stringify(authHeader))

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(HttpStatusCode.UNAUTHORIZED).json(new ErrorResponse(false, 'Can not find token'))
		}

		const token = authHeader.split(' ')[1]

		jwt.verify(token, ACCESS_KEY!, (err, decodedValue) => {
			if (err || !decodedValue || typeof decodedValue === 'string') {
				return res.status(HttpStatusCode.UNAUTHORIZED).json(new ErrorResponse(false, 'Invalid token', err))
			}

			// ✅ Gán user info vào request
			;(req as any).sub = decodedValue.sub
			next() // ✅ Quan trọng: chỉ next() nếu hợp lệ
		})
	} catch (error) {
		return res.status(HttpStatusCode.UNAUTHORIZED).json(new ErrorResponse(false, 'Internal Server Error', error))
	}
}
