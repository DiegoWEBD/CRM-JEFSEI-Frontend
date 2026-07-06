'use client'

import { useAuthContext } from '@/contexts/auth-context'

export function useUserSession() {
	return useAuthContext()
}
