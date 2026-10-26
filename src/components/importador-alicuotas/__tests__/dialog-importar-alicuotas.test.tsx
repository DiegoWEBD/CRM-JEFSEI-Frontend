import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/importacion-alicuotas/use-analizar-alicuotas', () => ({
	useAnalizarAlicuotas: vi.fn(),
}))
vi.mock('@/hooks/importacion-alicuotas/use-validar-alicuotas', () => ({
	useValidarAlicuotas: vi.fn(),
}))

import type {
	AnalizarAlicuotasResponse,
	RegistroAlicuota,
	ValidarAlicuotasResponse,
} from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { useAnalizarAlicuotas } from '@/hooks/importacion-alicuotas/use-analizar-alicuotas'
import { useValidarAlicuotas } from '@/hooks/importacion-alicuotas/use-validar-alicuotas'
import { TAMANO_MAXIMO_ARCHIVO } from '@/lib/archivos'
import { archivoSintetico } from '@/test/fixtures/sesion'
import DialogImportarAlicuotas from '../dialog-importar-alicuotas'

const useAnalizarMock = vi.mocked(useAnalizarAlicuotas)
const useValidarMock = vi.mocked(useValidarAlicuotas)

function analisisCon(
	parciales: Partial<Omit<AnalizarAlicuotasResponse, 'sugerencias'>> & {
		sugerencias?: Partial<AnalizarAlicuotasResponse['sugerencias']>
	} = {},
): AnalizarAlicuotasResponse {
	const { sugerencias = {}, ...resto } = parciales
	return {
		hojas: [{ nombre: 'Hoja1', filas: 10, columnas: 3 }],
		hoja_seleccionada: 'Hoja1',
		filas: 10,
		columnas: 3,
		vista_previa: {
			fila_desde: 1,
			fila_hasta: 2,
			columna_desde: 1,
			columna_hasta: 2,
			celdas: [
				[
					{ valor: 'Unidad', formula_sin_resultado: false },
					{ valor: 'Prorrateo', formula_sin_resultado: false },
				],
				[
					{ valor: 'A-101', formula_sin_resultado: false },
					{ valor: 0.5, formula_sin_resultado: false },
				],
			],
		},
		sugerencias: {
			fila_encabezados: 1,
			columna_identificador: 1,
			columna_prorrateo: 2,
			columnas_identificador_candidatas: [1],
			columnas_prorrateo_candidatas: [2],
			...sugerencias,
		},
		...resto,
	} as AnalizarAlicuotasResponse
}

function validacionCon(
	parciales: Partial<ValidarAlicuotasResponse> = {},
): ValidarAlicuotasResponse {
	return {
		registros: [],
		cantidad_registros: 0,
		problemas: [],
		tiene_errores_bloqueantes: false,
		confirmacion_requerida: false,
		suma_prorrateos: null,
		interpretacion: { tipo: 'valor_porcentual', requiere_confirmacion: false, motivo: null },
		filas_excluidas: [],
		...parciales,
	} as ValidarAlicuotasResponse
}

type MutationMock = {
	mutate: (variables: unknown, opts?: { onSuccess?: (data: never) => void }) => void
	isPending: boolean
	error: unknown
	reset: () => void
}

function instalarMutations({
	analisis = analisisCon(),
	validacion = validacionCon({ cantidad_registros: 1 }),
}: {
	analisis?: AnalizarAlicuotasResponse
	validacion?: ValidarAlicuotasResponse
} = {}) {
	const analizar: MutationMock = {
		mutate: (_vars, opts) => opts?.onSuccess?.(analisis as never),
		isPending: false,
		error: null,
		reset: () => {},
	}
	const validar: MutationMock = {
		mutate: (_vars, opts) => opts?.onSuccess?.(validacion as never),
		isPending: false,
		error: null,
		reset: () => {},
	}
	useAnalizarMock.mockReturnValue(analizar as never)
	useValidarMock.mockReturnValue(validar as never)
}

function renderDialog(onConfirmar = vi.fn()) {
	render(
		<DialogImportarAlicuotas open onOpenChange={() => {}} onConfirmar={onConfirmar} />,
	)
	return onConfirmar
}

/**
 * Fija el archivo del input.
 *
 * Se usa `fireEvent.change` y no `userEvent.upload` porque este último descarta
 * los archivos que no cumplen el `accept` del input y el evento no llegaría
 * nunca al componente. Lo que se verifica aquí es la validación propia del
 * importador, que debe fallar aunque alguien renombre un .csv a .xlsx.
 */
async function elegirArchivo(nombre: string, tamano = 1024) {
	const input = document.querySelector('input[type="file"]') as HTMLInputElement
	fireEvent.change(input, {
		target: { files: [archivoSintetico(tamano, nombre)] },
	})
}

const botonAnalizar = () => screen.getByRole('button', { name: /Analizar archivo/ })
const botonValidar = () => screen.findByRole('button', { name: /Validar registros/ })

/** Recorre el asistente hasta el paso de registros. */
async function avanzarARegistros(validacion: ValidarAlicuotasResponse) {
	instalarMutations({ validacion })
	const onConfirmar = renderDialog()
	const usuario = userEvent.setup()
	await elegirArchivo('alicuotas.xlsx')
	await usuario.click(botonAnalizar())
	await usuario.click(await botonValidar())
	return { onConfirmar, usuario }
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('Importador de alícuotas — tipo de archivo admitido', () => {
	it('rechaza un archivo que no sea .xlsx e informa el motivo', async () => {
		instalarMutations()
		renderDialog()

		await elegirArchivo('planilla.xls')

		expect(await screen.findByText('Solo se permiten archivos Excel (.xlsx)')).toBeInTheDocument()
		expect(botonAnalizar()).toBeDisabled()
	})

	it('rechaza un CSV aunque traiga datos válidos', async () => {
		instalarMutations()
		renderDialog()

		await elegirArchivo('alicuotas.csv')

		expect(await screen.findByText('Solo se permiten archivos Excel (.xlsx)')).toBeInTheDocument()
	})

	it('acepta un .xlsx y habilita el análisis', async () => {
		instalarMutations()
		renderDialog()

		await elegirArchivo('alicuotas-2026.xlsx')

		expect(screen.queryByText('Solo se permiten archivos Excel (.xlsx)')).toBeNull()
		expect(botonAnalizar()).toBeEnabled()
	})

	it('el selector de archivo solo admite .xlsx', () => {
		instalarMutations()
		renderDialog()

		expect(document.querySelector('input[type="file"]')).toHaveAttribute('accept', '.xlsx')
	})
})

describe('Importador de alícuotas — límite de tamaño', () => {
	it('rechaza un archivo que supera los 25 MB', async () => {
		instalarMutations()
		renderDialog()

		await elegirArchivo('alicuotas.xlsx', TAMANO_MAXIMO_ARCHIVO + 1)

		expect(await screen.findByText('El archivo no puede superar 25 MB')).toBeInTheDocument()
		expect(botonAnalizar()).toBeDisabled()
	})

	it('acepta un archivo justo en el límite', async () => {
		instalarMutations()
		renderDialog()

		await elegirArchivo('alicuotas.xlsx', TAMANO_MAXIMO_ARCHIVO)

		expect(botonAnalizar()).toBeEnabled()
	})
})

describe('Importador de alícuotas — coherencia de la configuración', () => {
	it('no permite validar cuando la columna de identificador y la de prorrateo coinciden', async () => {
		instalarMutations({
			analisis: analisisCon({ sugerencias: { columna_identificador: 2, columna_prorrateo: 2 } }),
		})
		renderDialog()
		const usuario = userEvent.setup()

		await elegirArchivo('alicuotas.xlsx')
		await usuario.click(botonAnalizar())

		expect(await botonValidar()).toBeDisabled()
	})

	it('no permite validar cuando las filas de datos terminan antes de los encabezados', async () => {
		instalarMutations({
			analisis: analisisCon({ sugerencias: { fila_encabezados: 5 }, filas: 3 }),
		})
		renderDialog()
		const usuario = userEvent.setup()

		await elegirArchivo('alicuotas.xlsx')
		await usuario.click(botonAnalizar())

		// primera_fila = 6 pero el archivo solo llega hasta la fila 3.
		expect(await botonValidar()).toBeDisabled()
	})

	it('permite validar con una configuración coherente', async () => {
		instalarMutations()
		renderDialog()
		const usuario = userEvent.setup()

		await elegirArchivo('alicuotas.xlsx')
		await usuario.click(botonAnalizar())

		expect(await botonValidar()).toBeEnabled()
	})
})

describe('Importador de alícuotas — bloqueos de la validación', () => {
	it('no deja continuar cuando la validación tiene errores bloqueantes', async () => {
		await avanzarARegistros(validacionCon({ tiene_errores_bloqueantes: true }))

		expect(await screen.findByRole('button', { name: 'Continuar' })).toBeDisabled()
	})

	it('no deja continuar cuando el servidor pide confirmación de la interpretación', async () => {
		await avanzarARegistros(validacionCon({ confirmacion_requerida: true }))

		expect(await screen.findByRole('button', { name: 'Continuar' })).toBeDisabled()
	})

	it('no deja continuar cuando no hay registros para importar', async () => {
		await avanzarARegistros(validacionCon({ cantidad_registros: 0 }))

		expect(await screen.findByRole('button', { name: 'Continuar' })).toBeDisabled()
	})

	it('permite continuar cuando la validación es limpia y hay registros', async () => {
		await avanzarARegistros(validacionCon({ cantidad_registros: 3 }))

		expect(await screen.findByRole('button', { name: 'Continuar' })).toBeEnabled()
	})
})

describe('Importador de alícuotas — qué se llega a importar', () => {
	const REGISTROS: RegistroAlicuota[] = [
		{
			fila_origen: 2,
			identificador_unidad: 'A-101',
			prorrateo_original: 0.5,
			prorrateo: 0.5,
			estado: 'valido',
			problemas: [],
		},
		{
			fila_origen: 3,
			identificador_unidad: 'A-102',
			prorrateo_original: null,
			prorrateo: null,
			estado: 'valido',
			problemas: [],
		},
		{
			fila_origen: 4,
			identificador_unidad: 'A-103',
			prorrateo_original: 0.25,
			prorrateo: 0.25,
			estado: 'error',
			problemas: [
				{ fila_origen: 4, campo: 'prorrateo', mensaje: 'Duplicado', severidad: 'error' },
			],
		},
		{
			fila_origen: 5,
			identificador_unidad: 'A-104',
			prorrateo_original: 0.25,
			prorrateo: 0.25,
			estado: 'pendiente',
			problemas: [],
		},
	]

	it('solo importa los registros válidos y con prorrateo numérico', async () => {
		const { onConfirmar, usuario } = await avanzarARegistros(
			validacionCon({
				registros: REGISTROS,
				cantidad_registros: REGISTROS.length,
				suma_prorrateos: 0.75,
			}),
		)

		await usuario.click(await screen.findByRole('button', { name: 'Continuar' }))
		await usuario.click(await screen.findByRole('button', { name: 'Importar unidades' }))

		await waitFor(() => expect(onConfirmar).toHaveBeenCalledTimes(1))
		const resultado = onConfirmar.mock.calls[0]![0] as {
			unidades: { identificador_unidad: string; prorrateo: number; fila_origen: number }[]
			cantidadUnidades: number
			nombreExcel: string
		}

		// A-102 queda fuera por no tener prorrateo; A-103 por estar en error;
		// A-104 por seguir pendiente.
		expect(resultado.unidades).toEqual([
			{ identificador_unidad: 'A-101', prorrateo: 0.5, fila_origen: 2 },
		])
		expect(resultado.cantidadUnidades).toBe(1)
		expect(resultado.nombreExcel).toBe('alicuotas.xlsx')
	})

	it('no declara la importación como hecha antes de pulsar Importar unidades', async () => {
		const { onConfirmar } = await avanzarARegistros(
			validacionCon({ registros: REGISTROS, cantidad_registros: REGISTROS.length }),
		)

		// Analizar y validar solo preparan la vista previa: nada queda importado.
		expect(onConfirmar).not.toHaveBeenCalled()
	})
})
