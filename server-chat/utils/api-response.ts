export class SuccessResponse<T = string> {
	constructor(public success: boolean = true, public message: string, public data?: T) {}
}

export class ErrorResponse<T = string> {
	constructor(public success: boolean = false, public message: string, public error?: T) {}
}
