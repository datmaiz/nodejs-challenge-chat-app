import express from 'express'
import { getUserByEmail, getUserById, getUsers } from '../controllers'
import { verifyToken } from '../middlewares'

const userRouter = express.Router()

userRouter.get(
	'/',
	async (req, res, next) => {
		await verifyToken(req, res, next)
	},
	async (req, res) => {
		await getUsers(req, res)
	}
)

userRouter.get(
	'/get-by-email/:email',
	async (req, res, next) => {
		await verifyToken(req, res, next)
	},
	async (req, res) => {
		await getUserByEmail(req, res)
	}
)

userRouter.get(
	'/get-by-id/:id',
	async (req, res, next) => {
		await verifyToken(req, res, next)
	},
	async (req, res) => {
		await getUserById(req, res)
	}
)

export { userRouter }
