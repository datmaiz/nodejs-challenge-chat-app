import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const SignInPage = lazy(() => import('@/pages/sign-in.page').then(module => ({ default: module.default })))
const RegisterPage = lazy(() => import('@/pages/register.page').then(module => ({ default: module.default })))
const HomePage = lazy(() => import('@/pages/home.page').then(module => ({ default: module.default })))
const ChatPage = lazy(() => import('@/pages/chat.page').then(module => ({ default: module.default })))

import { SocketProvider, UserProvider } from './data/providers'
import AuthLayout from './layouts/auht-layout.layout'
import ProtectedLayout from './layouts/protected-layout.layout'
import PublicLayout from './layouts/public-layout.layout'

import './App.css'

function App() {
	return (
		<BrowserRouter>
			<ToastContainer
				pauseOnHover={false}
				autoClose={3000}
			/>
			<UserProvider>
				<SocketProvider>
					<Routes>
						<Route
							path='/auth'
							element={<AuthLayout />}
						>
							<Route
								path='sign-in'
								element={<SignInPage />}
							/>
							<Route
								path='register'
								element={<RegisterPage />}
							/>
						</Route>

						<Route element={<PublicLayout />}>
							<Route
								path='/'
								element={<HomePage />}
							/>
						</Route>

						<Route element={<ProtectedLayout />}>
							<Route
								path='/chat'
								element={<ChatPage />}
							/>
						</Route>
					</Routes>
				</SocketProvider>
			</UserProvider>
		</BrowserRouter>
	)
}

export default App
