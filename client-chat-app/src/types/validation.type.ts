export type ValidationRule<V> = {
	fieldName?: string
	pattern?: RegExp
	required?: boolean
	minLength?: number
	maxLength?: number
	customValidate?: (values: V) => boolean
	errorMessage: string
}

export type ValidationSchema<T> = {
	[field in keyof T]: ValidationRule<T>
}

export type FormValues = {
	[field: string]: string
}
