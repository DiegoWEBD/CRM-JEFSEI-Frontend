import axios, {
	AxiosError,
	type AxiosAdapter,
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
} from 'axios'

/**
 * Simulación del límite de red para axios.
 *
 * Se sustituye el *adaptador HTTP* de la instancia, no la función que se está
 * verificando: los interceptores de request/response y el reintento siguen
 * ejecutándose de verdad. Así los tests no dependen de ningún servicio ni de
 * internet.
 */

export type LlamadaHttp = {
	url: string
	method: string
	baseURL?: string
	headers: Record<string, unknown>
	data: unknown
	params: unknown
}

export type RespuestaSimulada = {
	status: number
	data?: unknown
	headers?: Record<string, string>
}

export type Responder = (llamada: LlamadaHttp) => RespuestaSimulada | Promise<RespuestaSimulada>

export type RedSimulada = {
	llamadas: LlamadaHttp[]
	/** Última llamada que coincide con la condición, o undefined. */
	buscar(condicion: (l: LlamadaHttp) => boolean): LlamadaHttp | undefined
	restaurar(): void
}

function aRespuestaAxios(
	config: AxiosRequestConfig,
	respuesta: RespuestaSimulada,
): AxiosResponse {
	return {
		data: respuesta.data,
		status: respuesta.status,
		statusText: '',
		headers: respuesta.headers ?? {},
		config: config as AxiosResponse['config'],
		request: null,
	}
}

function aErrorAxios(
	config: AxiosRequestConfig,
	respuesta: RespuestaSimulada,
): AxiosError {
	// Se usa el error real de axios para que `axios.isAxiosError` y, por tanto,
	// `normalizarErrorServidor` se comporten igual que en producción.
	return new AxiosError(
		`Request failed with status code ${respuesta.status}`,
		String(respuesta.status),
		config as AxiosResponse['config'],
		null,
		aRespuestaAxios(config, respuesta),
	)
}

/**
 * Instala un adaptador falso en las instancias indicadas (por defecto la global
 * de axios, que es la que usa el reintento de `client-axios.ts`).
 */
export function simularRed(responder: Responder, instancias?: AxiosInstance[]): RedSimulada {
	const objetivos = instancias ?? [axios]
	const llamadas: LlamadaHttp[] = []
	const anteriores = objetivos.map(i => i.defaults.adapter)

	const adapter: AxiosAdapter = async config => {
		const llamada: LlamadaHttp = {
			url: config.url ?? '',
			method: (config.method ?? 'get').toLowerCase(),
			baseURL: config.baseURL,
			headers: { ...(config.headers as Record<string, unknown>) },
			data: config.data,
			params: config.params,
		}
		llamadas.push(llamada)
		const respuesta = await responder(llamada)
		if (respuesta.status >= 400) throw aErrorAxios(config, respuesta)
		return aRespuestaAxios(config, respuesta)
	}

	objetivos.forEach(i => {
		i.defaults.adapter = adapter
	})

	return {
		llamadas,
		buscar: condicion => llamadas.find(condicion),
		restaurar() {
			objetivos.forEach((i, indice) => {
				i.defaults.adapter = anteriores[indice]
			})
		},
	}
}

/** Parsea un body `FormData` o JSON recibido en `config.data` para inspeccionar el payload. */
export function leerData(llamada: LlamadaHttp): unknown {
	const data = llamada.data
	if (typeof data === 'string') {
		try {
			return JSON.parse(data)
		} catch {
			return data
		}
	}
	return data
}
