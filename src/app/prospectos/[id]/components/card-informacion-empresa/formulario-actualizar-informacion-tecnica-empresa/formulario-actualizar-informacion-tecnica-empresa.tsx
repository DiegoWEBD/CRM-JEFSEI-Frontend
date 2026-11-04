import { Button } from '@/components/button'
import { CardContent } from '@/components/card'
import { ProspectoEmpresa } from '@/dominio/prospecto-empresa/prospecto-empresa'
import { useFormularioActualizarProspectoEmpresa } from '@/hooks/prospectos/use-formulario-actualizar-prospecto-empresa'
import CamposAdicionalesProspectoEmpresa from '../../card-informacion-prospecto/formulario-actualizar-prospecto/campos-adicionales-prospecto-empresa/campos-adicionales-prospecto-empresa'

type FormularioActualizarInformacionTecnicaEmpresaProps = {
	prospecto: ProspectoEmpresa
	cancelarEdicionInformacion: () => void
}

export default function FormularioActualizarInformacionTecnicaEmpresa({
	prospecto,
	cancelarEdicionInformacion,
}: FormularioActualizarInformacionTecnicaEmpresaProps) {
	const { formik } = useFormularioActualizarProspectoEmpresa({
		prospecto,
		onComplete: cancelarEdicionInformacion,
	})

	return (
		<CardContent className='space-y-4 p-4'>
			<form onSubmit={formik.handleSubmit}>
				<div className='grid gap-4 sm:grid-cols-2'>
					<CamposAdicionalesProspectoEmpresa formik={formik} />
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
