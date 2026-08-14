import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type SidebarMode = 'expanded' | 'collapsed'

type SidebarStore = {
	/** Overlay móvil (drawer) */
	open: boolean
	setOpen: (value: boolean) => void
	toggle: () => void
	/** Modo desktop: expanded = sidebar completa, collapsed = mini-rail de iconos */
	mode: SidebarMode
	setMode: (value: SidebarMode) => void
	toggleMode: () => void
}

export const useSidebarStore = create<SidebarStore>()(
	persist(
		set => ({
			open: false,
			setOpen: value => set({ open: value }),
			toggle: () => set(state => ({ open: !state.open })),
			mode: 'expanded',
			setMode: value => set({ mode: value }),
			toggleMode: () =>
				set(state => ({
					mode: state.mode === 'expanded' ? 'collapsed' : 'expanded',
				})),
		}),
		{
			name: 'jefsei-sidebar',
			storage: createJSONStorage(() => localStorage),
			partialize: state => ({ mode: state.mode }),
			skipHydration: true,
		},
	),
)