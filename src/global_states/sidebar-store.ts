import { create } from 'zustand'

type SidebarStore = {
	open: boolean
	setOpen: (value: boolean) => void
	toggle: () => void
}

export const useSidebarStore = create<SidebarStore>(set => ({
	open: false,
	setOpen: value => set({ open: value }),
	toggle: () => set(state => ({ open: !state.open })),
}))
