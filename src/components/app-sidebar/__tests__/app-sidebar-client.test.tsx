import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SidebarProvider } from '@/components/sidebar'
import AppSidebarClient from '../app-sidebar-client/app-sidebar-client'

vi.mock('next/navigation', () => ({
	usePathname: () => '/',
}))

function renderSidebar(roles: string[]) {
	return render(
		<SidebarProvider>
			<AppSidebarClient roles={roles} />
		</SidebarProvider>,
	)
}

/**
 * Composición del sidebar de la app sobre las primitivas de shadcn.
 *
 * Alcance: smoke test de la estructura (branding, menú, footer de colapso).
 * La visibilidad de los ítems por rol está cubierta en `nav/__tests__/nav.test.tsx`.
 */
describe('AppSidebarClient — composición del sidebar', () => {
	it('renderiza branding, navegación y el botón de colapso', () => {
		renderSidebar(['GERENTE_GENERAL'])

		expect(screen.getByText('CRM JEFSEI')).toBeInTheDocument()
		expect(screen.getByText('Corredora de Seguros')).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /Inicio/ })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /Contraer/ })).toBeInTheDocument()
	})

	it('el botón del footer colapsa el sidebar al modo mini-rail (icon)', async () => {
		const user = userEvent.setup()
		const { container } = renderSidebar([])

		expect(container.querySelector('[data-slot="sidebar"]')).toHaveAttribute(
			'data-state',
			'expanded',
		)

		await user.click(screen.getByRole('button', { name: /Contraer/ }))

		const sidebar = container.querySelector('[data-slot="sidebar"]')
		expect(sidebar).toHaveAttribute('data-state', 'collapsed')
		expect(sidebar).toHaveAttribute('data-collapsible', 'icon')
	})
})
