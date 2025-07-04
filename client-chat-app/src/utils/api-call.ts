/* eslint-disable @typescript-eslint/no-explicit-any */
type Method = 'GET' | 'POST'

type ReplacePath<T extends string, P> = T extends `${infer S}:${infer Param}/${infer R}`
	? P extends Record<string, any>
		? P[Param] extends string | number
			? `${S}${P[Param]}/${ReplacePath<R, P>}`
			: never
		: never
	: T extends `${infer S}:${infer Param}`
	? P extends Record<string, any>
		? P[Param] extends string | number
			? `${S}${P[Param]}`
			: never
		: never
	: T

function replacePathParams(path: string, params: Record<string, string | number>): string {
	return path.replace(/:([a-zA-Z_]+)/g, (_, key) => params[key]?.toString() ?? '')
}

export async function callAPI<Path extends keyof APIEndpoints>(
	path: Path,
	options: APIEndpoints[Path]['method'] extends 'GET'
		? { params?: APIEndpoints[Path]['params'] }
		: { body: APIEndpoints[Path]['body'] }
) {
	const def = allMethods[path]

	let finalPath = path as string
	if (def.pathParams && 'params' in options) {
		finalPath = replacePathParams(path as string, options.params || {})
	}

	if (def.method === 'GET') {
		return axiosInstance.get(finalPath, { params: 'params' in options ? options.params : {} }).then(res => res.data)
	} else {
		return axiosInstance.post(finalPath, 'body' in options ? options.body : {}).then(res => res.data)
	}
}

import { allEndpoints, type APIEndpoints } from '@/apis/endpoints/schema'
import { axiosInstance } from './axios-instance'

const allMethods = Object.entries(allEndpoints).reduce((acc, [path, def]) => {
	acc[path as keyof APIEndpoints] = {
		method: def.method as Method,
		pathParams: (path.match(/:([a-zA-Z_]+)/g) || []).map(p => p.slice(1)),
	}
	return acc
}, {} as Record<keyof APIEndpoints, { method: Method; pathParams: string[] }>)
