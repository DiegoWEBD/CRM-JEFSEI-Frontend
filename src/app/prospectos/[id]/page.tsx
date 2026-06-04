import { obtenerProspecto } from '@/aplicacion/prospectos/use-cases/obtener-prospecto/obtener-prospecto'
import { cookies } from 'next/headers'
import PaginaProspectoClient from './components/pagina-prospecto-client/pagina-prospecto-client'

type ProspectoPageProps = {
	params: Promise<{
		id: string
	}>
}

export default async function ProspectoPage({ params }: ProspectoPageProps) {
	const { id } = await params

	const cookieStore = await cookies()
	const cookieHeader = cookieStore.toString()

	const prospecto = await obtenerProspecto(Number(id), cookieHeader)

	return <PaginaProspectoClient prospectoInicial={prospecto} />
}
