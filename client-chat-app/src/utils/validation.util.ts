import { type FormValues, type ValidationSchema } from '@/types'

type RegisterValidateSchema = {
	name: string
	email: string
	password: string
	confirmPassword: string
}

type SignInValidateSchema = {
	email: string
	password: string
}

export const regex: Record<string, RegExp> = {
	email: /^[\w-]{3,}@([\w-]+\.)+[\w-]{2,4}$/, // email username at least 5 letters,
	password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, // includes at least one uppercase letter, one lowercase letter, one number, and one special character, password length at least 8 letter
}

export const validate = <T>(formValues: FormValues, validationSchema: ValidationSchema<T>) => {
	const errors: Record<string, string> = {}

	Object.keys(validationSchema).forEach(field => {
		const rules = validationSchema[field as keyof T]
		const value = formValues[field]

		if (rules.required && !value.trim()) {
			errors[field] = `${rules.fieldName || field} is required.`
			return
		}

		// Check pattern
		if (rules.pattern && !rules.pattern.test(value)) {
			errors[field] = rules.errorMessage
			return
		}

		// Check min length
		if (rules.minLength && value.length < rules.minLength) {
			errors[field] = `${rules.fieldName || field} must be at least ${rules.minLength} characters long.`
			return
		}

		// Check max length
		if (rules.maxLength && value.length > rules.maxLength) {
			errors[field] = `${rules.fieldName || field} must be less than ${rules.maxLength} characters long.`
			return
		}

		// Check custom typeValidationSchema
		if (rules.customValidate && !rules.customValidate(formValues as T)) {
			errors[field] = rules.errorMessage
		}
	})

	return errors as T
}

export const registerValidateSchema: ValidationSchema<RegisterValidateSchema> = {
	email: {
		fieldName: 'Email',
		required: true,
		pattern: regex.email,
		errorMessage: 'Email username at least 5 letters and email must be valid',
	},
	password: {
		fieldName: 'Password',
		required: true,
		pattern: regex.password,
		errorMessage:
			'Password at least one uppercase letter, one lowercase letter, one number, and one special character, password length at least 8 letters',
	},
	confirmPassword: {
		fieldName: 'Confirm password',
		required: true,
		customValidate: ({ confirmPassword, password }) => confirmPassword === password,
		errorMessage: 'Password do not match',
	},
	name: {
		fieldName: 'Name',
		required: true,
		errorMessage: 'Name is required and at least 3 characters',
		customValidate({ name }) {
			return name.trim().length >= 3
		},
	},
}

export const signInValidateSchema: ValidationSchema<SignInValidateSchema> = {
	email: {
		fieldName: 'Email',
		required: true,
		pattern: regex.email,
		errorMessage: 'Email must be valid',
	},
	password: {
		fieldName: 'Password',
		required: true,
		pattern: regex.password,
		errorMessage:
			'Password at least one uppercase letter, one lowercase letter, one number, and one special character, password length at least 8 letters',
	},
}
