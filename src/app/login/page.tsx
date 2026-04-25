'use client'

import { useRouter } from 'next/navigation'
import LoginForm from './components/login-form'
import { useAuthStore } from '@/global_states/auth_store'
import { useEffect } from 'react'

const LoginPage = () => {
	const router = useRouter()
	const { token } = useAuthStore()

	useEffect(() => {
		if (token) {
			router.push('/home')
		}
	}, [token, router])

	return <LoginForm />
}

export default LoginPage
