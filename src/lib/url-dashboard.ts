/**
 * Actualiza los parámetros del dashboard (`tab`, `mes`, `year`) en la URL
 * con `replaceState` (routing superficial): no dispara un roundtrip al
 * servidor y conserva los demás parámetros presentes en la query string.
 */
export function actualizarUrlDashboard(params: {
	tab?: string
	mes?: number
	year?: number
}): void {
	if (typeof window === 'undefined') return

	const searchParams = new URLSearchParams(window.location.search)
	if (params.tab !== undefined) searchParams.set('tab', params.tab)
	if (params.mes !== undefined) searchParams.set('mes', String(params.mes))
	if (params.year !== undefined) searchParams.set('year', String(params.year))

	const query = searchParams.toString()
	window.history.replaceState(
		null,
		'',
		query ? `?${query}` : window.location.pathname,
	)
}
