import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/estados-admin/use-actualizar-transicion', () => ({
	useActualizarTransicion: vi.fn(),
}))
vi.mock('@/hooks/roles/use-obtener-roles', () => ({
	useObtenerRoles: vi.fn(),
}))

import type { EstadoConfiguracion } from '@/aplicacion/estados-admin/dto/estado-configuracion'
import type { TransicionAdmin } from '@/aplicacion/estados-admin/dto/transicion-admin'
import { useActualizarTransicion } from '@/hooks/estados-admin/use-actualizar-transicion'
import { useObtenerRoles } from '@/hooks/roles/use-obtener-roles'
import DialogEditarTransicion from '../dialog-editar-transicion'

const useActualizarTransicionMock = vi.mocked(useActualizarTransicion)
const useObtenerRolesMock = vi.mocked(useObtenerRoles)

const ROLES = [
	{ codigo: 'EJECUTIVO_COMERCIAL', nombre: 'Ejecutivo Comercial' },
	{ codigo: 'EJECUTIVO_RENOVACION', nombre: 'Ejecutivo de Renovación' },
	{ codigo: 'GERENTE_COMERCIAL', nombre: 'Gerente Comercial' },
]

const GRUPO_NUEVAS = 'Responsables — Oportunidades nuevas'
const GRUPO_RENOVACION = 'Responsables — Oportunidades de renovación'

function grupoResponsables(nombre: string) {
	return within(screen.getByRole('group', { name: nombre }))
}

function estadoFixture(): EstadoConfiguracion {
	return {
		codigo: 'OPORTUNIDAD_CREADA',
		nombre: 'Oportunidad creada',
		codigo_etapa: 'ETAPA_1',
		nombre_etapa: 'Prospección',
		probabilidad_cierre: 0.05,
		cantidad_transiciones: 2,
	}
}

function transicionFixture(
	partial: Partial<TransicionAdmin> = {},
): TransicionAdmin {
	return {
		codigo_estado_origen: 'OPORTUNIDAD_CREADA',
		codigo_estado_destino: 'COTIZACION_SOLICITADA_COMPANY',
		nombre_estado_origen: 'Oportunidad creada',
		nombre_estado_destino: 'Cotización solicitada',
		es_manual: true,
		es_principal: true,
		accion_requerida: 'solicitar cotización',
		dias_limite: 5,
		roles_responsables_nuevas: ['EJECUTIVO_COMERCIAL'],
		roles_responsables_renovacion: ['EJECUTIVO_RENOVACION'],
		...partial,
	}
}

async function montar({
	transicion = transicionFixture(),
	mutateAsync = vi.fn().mockResolvedValue({}),
}: {
	transicion?: TransicionAdmin
	mutateAsync?: ReturnType<typeof vi.fn>
} = {}) {
	useActualizarTransicionMock.mockReturnValue({
		mutateAsync,
		mutate: vi.fn(),
		isPending: false,
	} as unknown as ReturnType<typeof useActualizarTransicion>)
	useObtenerRolesMock.mockReturnValue({
		data: ROLES,
		isLoading: false,
	} as unknown as ReturnType<typeof useObtenerRoles>)

	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	})

	return {
		mutateAsync,
		cerrarDialog: vi.fn(),
		...render(
			<QueryClientProvider client={queryClient}>
				<DialogEditarTransicion
					estado={estadoFixture()}
					transicion={transicion}
					dialogAbierto
					cerrarDialog={vi.fn()}
				/>
			</QueryClientProvider>,
		),
	}
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('DialogEditarTransicion — responsables de la transición principal', () => {
	it('muestra los selectores de responsables por tipo de oportunidad', async () => {
		await montar()

		expect(screen.getByText(GRUPO_NUEVAS)).toBeInTheDocument()
		expect(screen.getByText(GRUPO_RENOVACION)).toBeInTheDocument()
		expect(screen.getByRole('group', { name: GRUPO_NUEVAS })).toBeInTheDocument()
		expect(
			screen.getByRole('group', { name: GRUPO_RENOVACION }),
		).toBeInTheDocument()
	})

	it('marca los responsables actuales de la transición', async () => {
		await montar()

		const nuevas = grupoResponsables(GRUPO_NUEVAS)
		expect(
			nuevas.getByRole('checkbox', { name: 'Ejecutivo Comercial' }),
		).toBeChecked()
		expect(
			nuevas.getByRole('checkbox', { name: 'Ejecutivo de Renovación' }),
		).not.toBeChecked()
		expect(
			nuevas.getByRole('checkbox', { name: 'Gerente Comercial' }),
		).not.toBeChecked()

		const renovacion = grupoResponsables(GRUPO_RENOVACION)
		expect(
			renovacion.getByRole('checkbox', { name: 'Ejecutivo de Renovación' }),
		).toBeChecked()
	})

	it('envía los responsables modificados en la petición', async () => {
		const usuario = userEvent.setup()
		const { mutateAsync } = await montar()

		await usuario.click(
			grupoResponsables(GRUPO_NUEVAS).getByRole('checkbox', {
				name: 'Gerente Comercial',
			}),
		)
		await usuario.click(
			grupoResponsables(GRUPO_RENOVACION).getByRole('checkbox', {
				name: 'Ejecutivo de Renovación',
			}),
		)
		await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

		expect(mutateAsync).toHaveBeenCalledTimes(1)
		expect(mutateAsync.mock.calls[0][0]).toMatchObject({
			codigo_estado_origen: 'OPORTUNIDAD_CREADA',
			codigo_estado_destino: 'COTIZACION_SOLICITADA_COMPANY',
			dias_limite: 5,
			roles_responsables_nuevas: ['EJECUTIVO_COMERCIAL', 'GERENTE_COMERCIAL'],
			roles_responsables_renovacion: [],
		})
	})

	it('sin cambios conserva los responsables actuales', async () => {
		const usuario = userEvent.setup()
		const { mutateAsync } = await montar()

		await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

		expect(mutateAsync.mock.calls[0][0]).toMatchObject({
			roles_responsables_nuevas: ['EJECUTIVO_COMERCIAL'],
			roles_responsables_renovacion: ['EJECUTIVO_RENOVACION'],
		})
	})
})

describe('DialogEditarTransicion — transición secundaria', () => {
	it('no muestra los selectores de responsables', async () => {
		await montar({
			transicion: transicionFixture({
				es_principal: false,
				dias_limite: null,
				roles_responsables_nuevas: [],
				roles_responsables_renovacion: [],
			}),
		})

		expect(screen.queryByText(GRUPO_NUEVAS)).not.toBeInTheDocument()
		expect(screen.queryByText(GRUPO_RENOVACION)).not.toBeInTheDocument()
		expect(
			screen.queryByRole('group', { name: GRUPO_NUEVAS }),
		).not.toBeInTheDocument()
	})

	it('no envía los campos de responsables en la petición', async () => {
		const usuario = userEvent.setup()
		const { mutateAsync } = await montar({
			transicion: transicionFixture({
				es_principal: false,
				dias_limite: null,
				roles_responsables_nuevas: [],
				roles_responsables_renovacion: [],
			}),
		})

		await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

		const payload = mutateAsync.mock.calls[0][0]
		expect(payload.roles_responsables_nuevas).toBeUndefined()
		expect(payload.roles_responsables_renovacion).toBeUndefined()
	})
})
