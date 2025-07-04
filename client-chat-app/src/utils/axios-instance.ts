import { refreshToken } from '@/apis/services'
import axios from 'axios'
import { isSuccess } from './api-response'
import { baseURL } from './constants'

const axiosInstance = axios.create({
	baseURL,
	withCredentials: true,
})

axiosInstance.interceptors.request.use(
	async config => {
		try {
			const token = localStorage.getItem('accessToken')

			if (token) {
				const decodedToken = JSON.parse(atob(token.split('.')[1]))
				const isExpired = decodedToken.exp < Date.now() / 1000

				if (isExpired) {
					const response = await refreshToken()
					if (isSuccess(response)) {
						localStorage.setItem('accessToken', response.data?.accessToken || '')
						config.headers.Authorization = `Bearer ${response.data?.accessToken}`
					}

					return config
				}

				config.headers.Authorization = `Bearer ${token}`
			}

			return config
		} catch (error) {
			console.error('Error in request interceptor:', error)
			return Promise.reject(error)
		}
	},
	error => Promise.reject(error)
)

export { axiosInstance }
