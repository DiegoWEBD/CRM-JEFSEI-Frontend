import { Button } from '@/components/button'
import { CardContent } from '@/components/card'
import Campo from '@/components/forms/campo/campo'
import Input from '@/components/forms/input/input'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import { useFormularioActualizarProspectoCondominio } from '@/hooks/prospectos/use-formulario-actualizar-prospecto-condominio'
import CamposAdicionalesProspectoCondominio from '../../card-informacion-prospecto/formulario-actualizar-prospecto/campos-adicionales-prospecto-condominio/campos-adicionales-prospecto-condominio'

type FormularioActualizarInformacionTecnicaCondominioProps = {
	prospecto: Prospecto
	cancelarEdicionInformacion: () => void
}

export default function FormularioActualizarInformacionTecnicaCondominio({
	prospecto,
	cancelarEdicionInformacion,
}: FormularioActualizarInformacionTecnicaCondominioProps) {
	const { formik } = useFormularioActualizarProspectoCondominio({
		prospecto,
		onComplete: cancelarEdicionInformacion,
	})

	return (
		<CardContent className='space-y-4 p-4'>
			<form onSubmit={formik.handleSubmit}>
				<div className='grid gap-4 sm:grid-cols-2'>
					<CamposAdicionalesProspectoCondominio formik={formik} />

					<Campo label='Porcentaje de espacios comunes'>
						<Input
							name='porcentaje_espacios_comunes'
							type='number'
							value={formik.values.porcentaje_espacios_comunes}
							onChange={formik.handleChange}
						/>
					</Campo>
				</div>
				<div className='flex flex-wrap justify-end gap-2 border-t mt-6 border-border pt-3'>
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='h-8 text-xs'
						onClick={cancelarEdicionInformacion}
					>
						Cancelar
					</Button>
					<Button type='submit' size='sm' className='h-8 text-xs'>
						Guardar cambios
					</Button>
				</div>
			</form>
		</CardContent>
	)
}
