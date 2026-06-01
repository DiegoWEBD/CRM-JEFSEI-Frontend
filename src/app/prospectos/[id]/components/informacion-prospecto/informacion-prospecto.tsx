import { Prospecto } from '@/dominio/prospecto/prospecto'
import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import { FiPhone, FiUser } from 'react-icons/fi'
import ItemInformacion from './item-informacion/item-informacion'
import CardTitle from '@/components/card/card-title/card-title'

type InformacionProspectoProps = {
	prospectoPromise: Promise<Prospecto>
}

const InformacionProspecto = async ({
	prospectoPromise,
}: InformacionProspectoProps) => {
	const prospecto = await prospectoPromise

	return (
		<Card>
			<CardHeader>
				<CardTitle>Información del prospecto</CardTitle>
				<FiUser />
			</CardHeader>
			<div className='flex flex-col gap-4 xl:flex-row'>
				<ItemInformacion
					title='Teléfono'
					info={prospecto.telefono_contacto}
					icon={<FiPhone />}
				/>

				<ItemInformacion
					title='Email'
					info={prospecto.correo_contacto || 'No disponible'}
					icon={<FiPhone />}
				/>
			</div>
		</Card>
	)
}

export default InformacionProspecto
