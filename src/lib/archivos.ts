// Límite máximo de tamaño para archivos subidos al servidor.
// Coincide con el `client_max_body_size` definido en nginx (25 MiB).
export const TAMANO_MAXIMO_ARCHIVO = 25 * 1024 * 1024

// Devuelve null si el archivo es válido, o un mensaje de error si excede el tamaño máximo.
export function validarTamanoArchivo(archivo: File): string | null {
	if (archivo.size > TAMANO_MAXIMO_ARCHIVO) {
		return 'El archivo no puede superar 25 MB'
	}

	return null
}
