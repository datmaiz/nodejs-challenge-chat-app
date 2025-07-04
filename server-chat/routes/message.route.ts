import express from 'express'
import { createMessage, getMessageChat } from '../controllers'
import { verifyToken } from '../middlewares'

const messageRouter = express.Router()

messageRouter.get(
	'/',
	async (req, res, next) => {
		await verifyToken(req, res, next)
	},
	async (req, res) => {
		await getMessageChat(req, res)
	}
)

messageRouter.post(
	'/',
	async (req, res, next) => {
		await verifyToken(req, res, next)
	},
	async (req, res) => {
		await createMessage(req, res)
	}
)

export { messageRouter }
