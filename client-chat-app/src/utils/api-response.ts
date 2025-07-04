export class APIResponse {
	constructor(public success: boolean = true, public message: string) {}
}

export class SuccessResponse<T = string> extends APIResponse {
	constructor(public success: boolean = true, public message: string, public data?: T) {
		super(success, message)
	}
}

export class ErrorResponse<T = string> extends APIResponse {
	constructor(public success: boolean = false, public message: string, public error?: T) {
		super(success, message)
	}
}

export function isSuccess<T, E>(res: SuccessResponse<T> | ErrorResponse<E>): res is SuccessResponse<T> {
	return res.success === true
}
