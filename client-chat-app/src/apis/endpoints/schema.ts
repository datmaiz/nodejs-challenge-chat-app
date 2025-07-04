import { authEndpoints } from './auth.endpoint'
import { userEndpoints } from './user.endpoint'

export const allEndpoints = {
	...authEndpoints,
	...userEndpoints,
} as const

export type APIEndpoints = {
	[K in keyof typeof allEndpoints]: {
		method: (typeof allEndpoints)[K]['method']
		params: (typeof allEndpoints)[K]['params']
		body: (typeof allEndpoints)[K]['body']
	}
}
