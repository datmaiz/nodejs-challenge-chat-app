import type { UserResponse } from '@/types'
import { ErrorResponse, SuccessResponse } from '@/utils/api-response'
import { axiosInstance } from '@/utils/axios-instance'
import { AxiosError } from 'axios'

export const getUsers = async (): Promise<SuccessResponse<UserResponse[]> | ErrorResponse> => {
	try {
		const response = await axiosInstance.get('/users')
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
