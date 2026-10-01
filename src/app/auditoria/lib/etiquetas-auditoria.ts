export const ETIQUETAS_EVENTO: Record<string, string> = {
	LOGIN_EXITOSO: 'Login exitoso',
	LOGIN_FALLIDO: 'Login fallido',
	LOGOUT: 'Cierre de sesión',
	CREAR: 'Creación',
	ACTUALIZAR: 'Actualización',
	ELIMINAR: 'Eliminación',
	EJECUTAR_ACCION: 'Acción',
}

export const EVENTOS_CONEXION = ['LOGIN_EXITOSO', 'LOGIN_FALLIDO', 'LOGOUT']

export const EVENTOS_ACCION = [
	'CREAR',
	'ACTUALIZAR',
	'ELIMINAR',
	'EJECUTAR_ACCION',
]

export const eventosPorCategoria = (
	categoria: string | null,
): string[] => {
	if (categoria === 'AUTENTICACION') return EVENTOS_CONEXION
	if (categoria === 'ACCION_NEGOCIO') return EVENTOS_ACCION
	return [...EVENTOS_CONEXION, ...EVENTOS_ACCION]
}

export const etiquetaEvento = (evento: string | null): string => {
	if (!evento) return '-'
	return ETIQUETAS_EVENTO[evento] ?? evento
}
