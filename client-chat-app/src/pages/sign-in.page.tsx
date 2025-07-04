import { ArrowRight, Eye, EyeOff, Loader, Lock, Mail } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { signIn } from '@/apis/services'
import { Button, Input } from '@/components/ui'
import { useLoading, useUserContext } from '@/hooks'
import { signInValidateSchema, validate } from '@/utils'
import { isSuccess } from '@/utils/api-response'

type FormFields = {
	email: string
	password: string
}

export default function SignInPage() {
	const navigate = useNavigate()
	const { loading, execute } = useLoading()
	const { setIsLoggedIn, setUser, setAccessToken } = useUserContext()

	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState<FormFields>({
		email: 'vuongngo@gmail.com',
		password: 'Vuong@12345',
	})
	const [errors, setErrors] = useState<FormFields>({ email: '', password: '' })

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async () => {
		execute(async () => {
			const errors = validate(formData, signInValidateSchema)
			setErrors(errors)
			if (Object.keys(errors).length > 0) return

			const response = await signIn({ email: formData.email.trim(), password: formData.password.trim() })

			if (isSuccess(response)) {
				const accessToken = response?.data?.accessToken || ''
				const userInfo = response?.data?.user

				localStorage.setItem('accessToken', accessToken)
				localStorage.setItem('user-info', JSON.stringify(userInfo))

				setIsLoggedIn(true)
				setUser(userInfo!)
				setAccessToken(accessToken)

				toast.success('Sign in successfully!')
				setFormData({ email: '', password: '' })
				navigate('/chat')
				return
			}

			if (!response.error) {
				toast.error(response.message)
			} else {
				setErrors(prev => ({ ...prev, ...response.error }))
			}
		})
	}

	return (
		<div className='space-y-6'>
			{/* Email */}
			<div className='space-y-2'>
				<label className='text-sm font-medium text-slate-700 mb-2 block'>Email Address</label>
				<div>
					<div className='relative'>
						<Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
						<Input
							type='email'
							name='email'
							value={formData.email}
							onChange={handleInputChange}
							className='w-full pl-10 pr-4 py-5'
							placeholder='Enter your email'
							disabled={loading}
							required
						/>
					</div>
					<p className='text-sm text-red-500 mt-2'>{errors.email}</p>
				</div>
			</div>

			{/* Password */}
			<div className='space-y-2'>
				<label className='text-sm font-medium text-slate-700 block mb-2'>Password</label>
				<div>
					<div className='relative'>
						<Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
						<Input
							type={showPassword ? 'text' : 'password'}
							name='password'
							value={formData.password}
							onChange={handleInputChange}
							className='w-full pl-10 pr-12 py-5'
							placeholder='Enter your password'
							disabled={loading}
							required
						/>
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'
						>
							{showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
						</button>
					</div>
					<p className='text-sm text-red-500 mt-2'>{errors.password}</p>
				</div>
			</div>

			{/* Forgot */}
			{/* <div className='text-right'>
				<button className='text-sm text-slate-600 hover:text-slate-800'>Forgot Password?</button>
			</div> */}

			{/* Submit */}
			<Button
				type='button'
				size={'lg'}
				onClick={handleSubmit}
				disabled={loading}
				className='w-full bg-gradient-to-r from-slate-600 to-slate-800'
			>
				{loading && <Loader className='animate-spin' />}
				Sign In
				<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
			</Button>

			{/* Switch */}
			<div className='text-center mt-8 text-slate-600'>
				Don't have an account?
				<button
					type='button'
					onClick={() => navigate('/auth/register')}
					className='ml-2 text-slate-700 hover:text-slate-900 font-semibold'
				>
					Sign Up
				</button>
			</div>
		</div>
	)
}
