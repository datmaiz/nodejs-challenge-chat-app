import { type NextFunction, type Request, type Response } from 'express'

export const logRequest = async (req: Request, res: Response, next: NextFunction) => {
	logging.log(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

	res.on('finish', () => {
		logging.log(
			`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
		)
	})

	next()
}
