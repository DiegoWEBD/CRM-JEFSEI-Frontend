import Usuario from '@/dominio/usuario/usuario'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
	token: string | null
	usuario: Usuario | null
	login: (token: string, usuario: Usuario) => void
	logout: () => void
}

export const useAuthStore = create<AuthStore>()(
	persist(
		set => ({
			token: null,
			usuario: null,

			login: (token, usuario) =>
				set({
					token,
					usuario,
				}),

			logout: () =>
				set({
					token: null,
					usuario: null,
				}),
		}),
		{
			name: 'auth-storage',
		},
	),
)
