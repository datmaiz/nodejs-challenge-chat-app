export const userEndpoints = {
	'/users': {
		method: 'GET',
		body: {},
		params: {},
	},
	'/users/get-by-email': {
		method: 'GET',
		params: { email: '' },
		body: {},
	},
}
