import Usuario from '@/dominio/usuario/usuario'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
	usuario: Usuario | null
	expiresAt: number | null
	hydrated: boolean
	login: (usuario: Usuario, expiresInMinutes: number) => void
	logout: () => void
	setHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
	persist(
		set => ({
			usuario: null,
			expiresAt: null,
			hydrated: false,

			login: (usuario, expiresInMinutes) => {
				const expiresAt = Date.now() + expiresInMinutes * 60 * 1000

				set({
					usuario,
					expiresAt,
				})
			},

			logout: () => {
				set({
					usuario: null,
					expiresAt: null,
				})
			},

			setHydrated: value => set({ hydrated: value }),
		}),
		{
			name: 'auth-storage',

			onRehydrateStorage: () => state => {
				if (!state) return

				const now = Date.now()

				if (!state.expiresAt || now > state.expiresAt) {
					state.usuario = null
					state.expiresAt = null
				}

				state.hydrated = true
			},
		},
	),
)
