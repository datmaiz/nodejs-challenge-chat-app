import express from 'express'

import { logout, refreshToken, register, signIn } from '../controllers'
import { verifyToken } from '../middlewares'

const authRouter = express.Router()

authRouter.post('/register', async (req, res) => {
	await register(req, res)
})

authRouter.post('/sign-in', async (req, res) => {
	await signIn(req, res)
})

authRouter.post('/refresh-token', async (req, res) => {
	await refreshToken(req, res)
})

authRouter.post(
	'/logout',
	async (req, res, next) => {
		await verifyToken(req, res, next)
	},
	async (req, res) => {
		await logout(req, res)
	}
)

export { authRouter }
