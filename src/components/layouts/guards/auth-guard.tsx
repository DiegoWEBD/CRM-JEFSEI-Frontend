'use client'

import { useAuthStore } from '@/global_states/auth_store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const { usuario, expiresAt, hydrated } = useAuthStore()
	const router = useRouter()

	useEffect(() => {
		if (!hydrated) return

		const now = Date.now()

		if (!usuario || !expiresAt || now > expiresAt) {
			router.replace('/login')
		}
	}, [usuario, expiresAt, hydrated, router])

	if (!hydrated) return null

	if (!usuario || !expiresAt) return null

	return <>{children}</>
}
