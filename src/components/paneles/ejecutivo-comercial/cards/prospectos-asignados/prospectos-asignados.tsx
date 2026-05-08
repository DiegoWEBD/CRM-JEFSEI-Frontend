import CardProspectos from '@/components/prospectos/card-prospectos/card-prospectos'
import { useProspectos } from '@/hooks/prospectos/use-prospectos'
import { useEffect } from 'react'

const ProspectosAsignados = () => {
	const { prospectos, cargarProspectos } = useProspectos()

	useEffect(() => {
		cargarProspectos()
	}, [cargarProspectos])

	return (
		<CardProspectos prospectos={prospectos} titulo='Prospectos asignados' />
	)
}

export default ProspectosAsignados
