import { ProspectoJson } from '@/aplicacion/prospectos/use-cases/obtener-prospecto/dto/prospecto-json'
import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import { FiPhone, FiUser } from 'react-icons/fi'
import ItemInformacion from './item-informacion/item-informacion'

type InformacionProspectoProps = {
	prospecto: ProspectoJson
}

const InformacionProspecto = ({ prospecto }: InformacionProspectoProps) => {
	return (
		<Card>
			<CardHeader title='Información del Prospecto' icon={<FiUser />} primary />
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
