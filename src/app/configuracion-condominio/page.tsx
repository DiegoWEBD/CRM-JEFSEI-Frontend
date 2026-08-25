'use client'

import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'
import PanelBody from '@/components/paneles/panel-layout/panel-body/panel-body'
import TablaValoresUfRegion from '@/components/configuracion-condominio/tabla-valores-uf-region'
import FormularioParametrosDepreciacion from '@/components/configuracion-condominio/formulario-parametros-depreciacion'
import { Settings } from 'lucide-react'

export default function ConfiguracionCondominioPage() {
	return (
		<PanelLayout>
			<PanelHeader>
				<div className='flex items-start gap-3'>
					<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12'>
						<Settings className='h-5 w-5 sm:h-6 sm:w-6' aria-hidden />
					</div>
					<div className='min-w-0 flex-1'>
						<h1 className='text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl'>
							Configuración de Condominio
						</h1>
						<p className='mt-1 text-xs text-muted-foreground'>
							Define los valores UF/m² por región y los parámetros de
							depreciación para cálculos de seguros.
						</p>
					</div>
				</div>
			</PanelHeader>

			<PanelBody className='lg:grid-cols-2'>
				<TablaValoresUfRegion />
				<FormularioParametrosDepreciacion />
			</PanelBody>
		</PanelLayout>
	)
}
