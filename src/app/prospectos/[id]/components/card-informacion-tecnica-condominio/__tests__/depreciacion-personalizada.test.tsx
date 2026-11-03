import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock(
	'@/hooks/prospectos/use-actualizar-porcentaje-depreciacion-personalizado',
	() => ({ useActualizarPorcentajeDepreciacionPersonalizado: vi.fn() }),
)
vi.mock('@/hooks/prospectos/use-actualizar-valor-uf-m2-personalizado', () => ({
	useActualizarValorUfM2Personalizado: vi.fn(),
}))

import type { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { useActualizarPorcentajeDepreciacionPersonalizado } from '@/hooks/prospectos/use-actualizar-porcentaje-depreciacion-personalizado'
import { useActualizarValorUfM2Personalizado } from '@/hooks/prospectos/use-actualizar-valor-uf-m2-personalizado'
import { payloadSesion, RUTS_SINTETICOS } from '@/test/fixtures/sesion'
import { renderConSesion } from '@/test/helpers/render-con-sesion'
import CardInformacionTecnicaCondominio from '../card-informacion-tecnica-condominio'

const useActualizarPorcentajeDepreciacionPersonalizadoMock = vi.mocked(
	useActualizarPorcentajeDepreciacionPersonalizado,
)
const useActualizarValorUfM2PersonalizadoMock = vi.mocked(
	useActualizarValorUfM2Personalizado,
)

const PERMISO_TODOS = 'ESTABLECER_DEPRECIACION_PERSONALIZADA_TODOS'
const PERMISO_PROPIOS = 'ESTABLECER_DEPRECIACION_PERSONALIZADA_PROPIOS'

function prospectoFixture({
	porcentajeDepreciacionPersonalizado = null,
	ejecutivoEvaluacionRut = RUTS_SINTETICOS.ejecutivoEvaluacion,
}: {
	porcentajeDepreciacionPersonalizado?: number | null
	ejecutivoEvaluacionRut?: string | null
} = {}) {
	return {
		id: 7,
		ejecutivo_comercial_asignado: {
			rut: RUTS_SINTETICOS.ejecutivoComercial,
			nombre: 'Eva Comercial',
		},
		ejecutivo_evaluacion_asignado: ejecutivoEvaluacionRut
			? { rut: ejecutivoEvaluacionRut, nombre: 'Eli Evaluación' }
			: null,
		porcentaje_depreciacion: 0.2,
		porcentaje_depreciacion_personalizado: porcentajeDepreciacionPersonalizado,
		valor_uf_m2_personalizado: null,
		uf_por_metro_cuadrado: 30,
	} as unknown as ProspectoCondominio
}

function montar({
	permisos = [PERMISO_TODOS],
	rutSesion = RUTS_SINTETICOS.gerenteGeneral,
	prospecto = prospectoFixture(),
	mutateAsync = vi.fn(async () => undefined),
	isPending = false,
}: {
	permisos?: string[]
	rutSesion?: string
	prospecto?: ProspectoCondominio
	mutateAsync?: ReturnType<typeof vi.fn>
	isPending?: boolean
} = {}) {
	useActualizarPorcentajeDepreciacionPersonalizadoMock.mockReturnValue({
		mutateAsync,
		isPending,
	} as unknown as ReturnType<typeof useActualizarPorcentajeDepreciacionPersonalizado>)
	useActualizarValorUfM2PersonalizadoMock.mockReturnValue({
		mutateAsync: vi.fn(async () => undefined),
		isPending: false,
	} as unknown as ReturnType<typeof useActualizarValorUfM2Personalizado>)

	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	})

	return renderConSesion(
		payloadSesion({ codigo_permisos: permisos, rut: rutSesion }),
		<QueryClientProvider client={queryClient}>
			<CardInformacionTecnicaCondominio prospecto={prospecto} />
		</QueryClientProvider>,
	)
}

const BOTON_DEPRECIACION = /depreciación personalizada/i
const INPUT_DEPRECIACION = 'Ingrese el porcentaje de depreciación personalizado'

async function abrirDialogoDepreciacion(
	usuario: ReturnType<typeof userEvent.setup>,
) {
	await usuario.click(screen.getByRole('button', { name: BOTON_DEPRECIACION }))
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('CardInformacionTecnicaCondominio — visibilidad de la depreciación personalizada', () => {
	it('con el permiso TODOS se muestra el botón aunque el ejecutivo asignado sea otro', async () => {
		await montar({
			permisos: [PERMISO_TODOS],
			rutSesion: RUTS_SINTETICOS.gerenteGeneral,
			prospecto: prospectoFixture({
				ejecutivoEvaluacionRut: RUTS_SINTETICOS.ejecutivoComercial,
			}),
		})

		expect(
			screen.getByRole('button', { name: BOTON_DEPRECIACION }),
		).toBeInTheDocument()
	})

	it('con el permiso PROPIOS se muestra el botón cuando el usuario es el ejecutivo de evaluación asignado', async () => {
		await montar({
			permisos: [PERMISO_PROPIOS],
			rutSesion: RUTS_SINTETICOS.ejecutivoEvaluacion,
			prospecto: prospectoFixture({
				ejecutivoEvaluacionRut: RUTS_SINTETICOS.ejecutivoEvaluacion,
			}),
		})

		expect(
			screen.getByRole('button', { name: BOTON_DEPRECIACION }),
		).toBeInTheDocument()
	})

	it('con el permiso PROPIOS no se muestra el botón cuando el ejecutivo asignado es otro', async () => {
		await montar({
			permisos: [PERMISO_PROPIOS],
			rutSesion: RUTS_SINTETICOS.ejecutivoEvaluacion,
			prospecto: prospectoFixture({
				ejecutivoEvaluacionRut: RUTS_SINTETICOS.gerenteGeneral,
			}),
		})

		expect(
			screen.queryByRole('button', { name: BOTON_DEPRECIACION }),
		).toBeNull()
	})

	it('con el permiso PROPIOS no se muestra el botón cuando no hay ejecutivo asignado', async () => {
		await montar({
			permisos: [PERMISO_PROPIOS],
			rutSesion: RUTS_SINTETICOS.ejecutivoEvaluacion,
			prospecto: prospectoFixture({ ejecutivoEvaluacionRut: null }),
		})

		expect(
			screen.queryByRole('button', { name: BOTON_DEPRECIACION }),
		).toBeNull()
	})

	it('sin permisos de depreciación no se muestra el botón', async () => {
		await montar({
			permisos: ['REGISTRAR_PROSPECTO'],
			rutSesion: RUTS_SINTETICOS.ejecutivoEvaluacion,
		})

		expect(
			screen.queryByRole('button', { name: BOTON_DEPRECIACION }),
		).toBeNull()
	})
})

describe('CardInformacionTecnicaCondominio — payload de la depreciación personalizada', () => {
	it('guarda el porcentaje ingresado en puntos porcentuales', async () => {
		const mutateAsync = vi.fn(async () => undefined)
		const usuario = userEvent.setup()
		await montar({ mutateAsync })

		await abrirDialogoDepreciacion(usuario)
		await usuario.type(screen.getByPlaceholderText(INPUT_DEPRECIACION), '20')
		await usuario.click(
			screen.getByRole('button', { name: 'Guardar cambios' }),
		)

		await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1))
		expect(mutateAsync).toHaveBeenCalledWith(20)
	})

	it('guardar sin ingresar valor envía null', async () => {
		const mutateAsync = vi.fn(async () => undefined)
		const usuario = userEvent.setup()
		await montar({ mutateAsync })

		await abrirDialogoDepreciacion(usuario)
		await usuario.click(
			screen.getByRole('button', { name: 'Guardar cambios' }),
		)

		await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1))
		expect(mutateAsync).toHaveBeenCalledWith(null)
	})

	it('usar valor calculado envía null para quitar la personalización', async () => {
		const mutateAsync = vi.fn(async () => undefined)
		const usuario = userEvent.setup()
		await montar({
			mutateAsync,
			prospecto: prospectoFixture({ porcentajeDepreciacionPersonalizado: 0.25 }),
		})

		await abrirDialogoDepreciacion(usuario)
		await usuario.click(
			screen.getByRole('button', { name: 'Usar valor calculado' }),
		)

		await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1))
		expect(mutateAsync).toHaveBeenCalledWith(null)
	})
})

describe('CardInformacionTecnicaCondominio — reflejo de la personalización', () => {
	it('el botón invita a editar cuando ya hay un porcentaje personalizado', async () => {
		await montar({
			prospecto: prospectoFixture({ porcentajeDepreciacionPersonalizado: 0.25 }),
		})

		expect(
			screen.getByRole('button', { name: /Editar depreciación personalizada/ }),
		).toBeInTheDocument()
	})

	it('el diálogo muestra el valor personalizado convertido a porcentaje', async () => {
		const usuario = userEvent.setup()
		await montar({
			prospecto: prospectoFixture({ porcentajeDepreciacionPersonalizado: 0.25 }),
		})

		await abrirDialogoDepreciacion(usuario)

		expect(screen.getByPlaceholderText(INPUT_DEPRECIACION)).toHaveValue(25)
	})

	it('muestra el badge Personalizado cuando hay porcentaje personalizado', async () => {
		await montar({
			prospecto: prospectoFixture({ porcentajeDepreciacionPersonalizado: 0.25 }),
		})

		expect(screen.getByText('Personalizado')).toBeInTheDocument()
	})

	it('no muestra el badge Personalizado cuando el valor viene de los parámetros', async () => {
		await montar()

		expect(screen.queryByText('Personalizado')).toBeNull()
	})
})
