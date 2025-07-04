import { TEST } from './constants'

const colours = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m',

	fg: {
		black: '\x1b[30m',
		red: '\x1b[31m',
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		blue: '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: '\x1b[36m',
		white: '\x1b[37m',
		crimson: '\x1b[38m',
	},
	bg: {
		black: '\x1b[40m',
		red: '\x1b[41m',
		green: '\x1b[42m',
		yellow: '\x1b[43m',
		blue: '\x1b[44m',
		magenta: '\x1b[45m',
		cyan: '\x1b[46m',
		white: '\x1b[47m',
		crimson: '\x1b[48m',
	},
}

export function getCallingFunction(error: Error) {
	try {
		const stack = error.stack

		if (stack === undefined) return '--'

		const line = stack.split('\n')[2]
		const regex = /^.*at\s([a-zA-Z]+).*$/
		const groups = line?.match(regex)

		if (!groups) return '--'

		if (groups.length < 2) return '--'

		return groups[1]
	} catch {
		return '--'
	}
}

export function log(message?: any, ...optionalParams: any[]) {
	if (!TEST)
		console.log(
			`[${new Date().toLocaleString()}]`,
			colours.fg.magenta,
			'[SERVER-LOG] ',
			colours.reset,
			message,
			...optionalParams
		)
}

export function info(message?: any, ...optionalParams: any[]) {
	if (!TEST)
		console.info(
			`[${new Date().toLocaleString()}]`,
			colours.fg.cyan,
			'[INFO]',
			colours.reset,
			colours.bg.green,
			`[${getCallingFunction(new Error())}]`,
			colours.reset,
			message,
			...optionalParams
		)
}

export function warn(message?: any, ...optionalParams: any[]) {
	if (!TEST)
		console.warn(
			`[${new Date().toLocaleString()}]`,
			colours.fg.yellow,
			'[WARN]',
			colours.reset,
			colours.bg.green,
			`[${getCallingFunction(new Error())}]`,
			colours.reset,
			message,
			...optionalParams
		)
}

export function error(message?: any, ...optionalParams: any[]) {
	if (!TEST)
		console.error(
			`[${new Date().toLocaleString()}]`,
			colours.fg.red,
			'[ERROR]',
			colours.reset,
			colours.bg.green,
			`[${getCallingFunction(new Error())}]`,
			colours.reset,
			message,
			...optionalParams
		)
}

export function get(message?: any, ...optionalParams: any[]) {
	if (!TEST)
		console.log(
			`[${new Date().toLocaleString()}]`,
			colours.fg.cyan,
			'[GET] ',
			colours.reset,
			message,
			...optionalParams
		)
}

export function post(message?: any, ...optionalParams: any[]) {
	if (!TEST)
		console.log(
			`[${new Date().toLocaleString()}]`,
			colours.fg.cyan,
			'[POST] ',
			colours.reset,
			message,
			...optionalParams
		)
}

export function patch(message?: any, ...optionalParams: any[]) {
	if (!TEST)
		console.log(
			`[${new Date().toLocaleString()}]`,
			colours.fg.cyan,
			'[PATCH] ',
			colours.reset,
			message,
			...optionalParams
		)
}

export function deleteLog(message?: any, ...optionalParams: any[]) {
	if (!TEST)
		console.log(
			`[${new Date().toLocaleString()}]`,
			colours.fg.cyan,
			'[DELET] ',
			colours.reset,
			message,
			...optionalParams
		)
}

export function put(message?: any, ...optionalParams: any[]) {
	if (!TEST)
		console.log(
			`[${new Date().toLocaleString()}]`,
			colours.fg.cyan,
			'[PUT] ',
			colours.reset,
			message,
			...optionalParams
		)
}

export function requestLog(method: string, message?: any, ...optionalParams: any[]) {
	if (!TEST)
		console.log(
			`[${new Date().toLocaleString()}]`,
			colours.fg.cyan,
			`[${method}]`,
			colours.reset,
			message,
			...optionalParams
		)
}

const logging = {
	log,
	info,
	warn,
	error,
	warning: warn,
	getCallingFunction,
	get,
	post,
	patch,
	put,
	deleteLog,
	requestLog,
}

/** Create the global definition */
declare global {
	var logging: {
		log: (message?: any, ...optionalParams: any[]) => void
		info: (message?: any, ...optionalParams: any[]) => void
		warn: (message?: any, ...optionalParams: any[]) => void
		warning: (message?: any, ...optionalParams: any[]) => void
		error: (message?: any, ...optionalParams: any[]) => void
		getCallingFunction: (error: Error) => string
		get: (message?: any, ...optionalParams: any[]) => void
		post: (message?: any, ...optionalParams: any[]) => void
		patch: (message?: any, ...optionalParams: any[]) => void
		put: (message?: any, ...optionalParams: any[]) => void
		deleteLog: (message?: any, ...optionalParams: any[]) => void
		requestLog: (method: string, message?: any, ...optionalParams: any[]) => void
	}
}

/** Link the local and global variable */
globalThis.logging = logging

export default logging
