import type { UserResponse } from '@/types'
import type { RegisterPayload, SignInPayload, SignInResponse } from '@/types/auth.type'
import { ErrorResponse, SuccessResponse } from '@/utils/api-response'
import { axiosInstance } from '@/utils/axios-instance'
import { baseURL } from '@/utils/constants'
import axios, { AxiosError } from 'axios'

export const signIn = async ({
	email,
	password,
}: SignInPayload): Promise<SuccessResponse<SignInResponse> | ErrorResponse<{ email: string; password: string }>> => {
	try {
		const response = await axiosInstance.post('/auth/sign-in', { email, password })
		const data = response.data

		if (!data.success) {
			return new ErrorResponse(false, data.message)
		}

		return new SuccessResponse(true, data.message, data.data)
	} catch (error) {
		console.log(error)
		if (error instanceof AxiosError) {
			return new ErrorResponse(false, error.response?.data.message, error.response?.data.error)
		}
		return new ErrorResponse(false, (error as Error).message)
	}
}

export const register = async ({
	email,
	password,
	name,
}: RegisterPayload): Promise<SuccessResponse<UserResponse> | ErrorResponse<{ email: string; password: string }>> => {
	try {
		const response = await axiosInstance.post('/auth/register', { email, password, name })
		const data = response.data
		console.log('data', data)

		if (!data.success) {
			return new ErrorResponse(false, data.message, data.error)
		}

		return new SuccessResponse(true, data.message, data.data)
	} catch (error) {
		console.log('error', error)
		if (error instanceof AxiosError) {
			return new ErrorResponse(false, error.response?.data.message, error.response?.data.error)
		}
		return new ErrorResponse(false, (error as Error).message)
	}
}

export const refreshToken = async (): Promise<SuccessResponse<{ accessToken: string }> | ErrorResponse> => {
	try {
		const response = await axios.post(baseURL + '/auth/refresh-token', {}, { withCredentials: true })
		const data = response.data

		if (!data.success) {
			return new ErrorResponse(false, data.message)
		}

		return new SuccessResponse(true, data.message, data.data)
	} catch (error) {
		console.log(error)
		if (error instanceof AxiosError) {
			return new ErrorResponse(false, (error as Error).message)
		}
		return new ErrorResponse(false, (error as Error).message)
	}
}

export const logout = async (): Promise<SuccessResponse<UserResponse> | ErrorResponse> => {
	try {
		const response = await axiosInstance.post('/auth/logout', {}, { withCredentials: true })
		const data = response.data

		if (!data.success) {
			return new ErrorResponse(false, data.message)
		}

		return new SuccessResponse(true, data.message, data.data)
	} catch (error) {
		console.log(error)
		if (error instanceof AxiosError) {
			return new ErrorResponse(false, (error as Error).message)
		}
		return new ErrorResponse(false, (error as Error).message)
	}
}
