import { register } from '@/apis/services'
import { Button, Input } from '@/components/ui'
import { useLoading } from '@/hooks'
import { registerValidateSchema, validate } from '@/utils'
import { isSuccess } from '@/utils/api-response'
import { ArrowRight, Eye, EyeOff, Loader, Lock, Mail, User } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

type FormFields = {
	name: string
	email: string
	password: string
	confirmPassword: string
}

export default function RegisterPage() {
	const navigate = useNavigate()
	const { loading, execute } = useLoading()

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [formData, setFormData] = useState<FormFields>({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [errors, setErrors] = useState<FormFields>({ email: '', password: '', name: '', confirmPassword: '' })

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async () => {
		execute(async () => {
			try {
				const errors = validate(formData, registerValidateSchema)
				setErrors(errors)
				if (Object.keys(errors).length > 0) {
					return
				}

				const response = await register({
					email: formData.email.trim(),
					password: formData.password.trim(),
					name: formData.name.trim(),
				})
				if (isSuccess(response)) {
					toast.success('Register successfully!')
					setFormData({ name: '', email: '', password: '', confirmPassword: '' })
					navigate('/auth/sign-in')
					return
				}

				if (!response.error) {
					toast.error(response.message)
				} else {
					setErrors(prev => ({ ...prev, ...response.error }))
				}
			} catch (error) {
				console.log(error)
			}
		})
	}

	return (
		<div className='space-y-6'>
			{/* Full Name */}
			<div className='space-y-2'>
				<label className='text-sm font-medium text-slate-700 block mb-2'>Full Name</label>
				<div>
					<div className='relative'>
						<User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
						<Input
							type='text'
							name='name'
							value={formData.name}
							onChange={handleInputChange}
							className='w-full pl-10 pr-4 py-5'
							placeholder='Enter your full name'
							disabled={loading}
							required
						/>
					</div>
					<p className='text-sm text-red-500 mt-2'>{errors.name}</p>
				</div>
			</div>

			{/* Email */}
			<div className='space-y-2'>
				<label className='text-sm font-medium text-slate-700 block mb-2'>Email Address</label>
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
				<label className='text-sm font-medium text-slate-700 block mb-3'>Password</label>
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
							disabled={loading}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'
						>
							{showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
						</button>
					</div>
					<p className='text-sm text-red-500 mt-2'>{errors.password}</p>
				</div>
			</div>

			{/* Confirm Password */}
			<div className='space-y-2'>
				<label className='text-sm font-medium text-slate-700 block mb-2'>Confirm Password</label>
				<div>
					<div className='relative'>
						<Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
						<Input
							type={showConfirmPassword ? 'text' : 'password'}
							name='confirmPassword'
							value={formData.confirmPassword}
							onChange={handleInputChange}
							className='w-full pl-10 pr-12 py-5'
							placeholder='Confirm your password'
							required
						/>
						<button
							type='button'
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'
						>
							{showConfirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
						</button>
					</div>
					<p className='text-sm text-red-500 mt-2'>{errors.confirmPassword}</p>
				</div>
			</div>

			{/* Submit */}
			<Button
				type='button'
				size={'lg'}
				onClick={handleSubmit}
				disabled={loading}
				className='w-full bg-gradient-to-r from-slate-600 to-slate-800'
			>
				{loading && <Loader className='animate-spin' />}
				Create Account
				<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
			</Button>

			{/* Switch */}
			<div className='text-center text-slate-600'>
				Already have an account?
				<button
					type='button'
					onClick={() => navigate('/auth/sign-in')}
					className='ml-2 text-slate-700 hover:text-slate-900 font-semibold'
				>
					Sign In
				</button>
			</div>
		</div>
	)
}
