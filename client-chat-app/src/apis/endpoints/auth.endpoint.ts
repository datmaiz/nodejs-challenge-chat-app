export const authEndpoints = {
	'/sign-in': {
		method: 'POST',
		body: { email: '', password: '' },
		params: {},
	},
	'/register': {
		method: 'POST',
		body: { email: '', password: '', name: '' },
		params: {},
	},
	'/refresh-token': {
		method: 'POST',
		body: {},
		params: {},
	},
}
