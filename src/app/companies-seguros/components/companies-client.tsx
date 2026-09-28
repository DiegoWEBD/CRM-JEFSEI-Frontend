'use client'

import { ObtenerCompaniesSegurosResponse } from '@/aplicacion/companies-seguros/dto/obtener-companies-seguros-response'
import { ConfirmDialog } from '@/components/confirm-dialog'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import CompanySeguro from '@/dominio/company-seguro/company-seguro'
import { useCompaniesSegurosPaginado } from '@/hooks/companies-seguros/use-companies-seguros-paginado'
import { useEliminarCompany } from '@/hooks/companies-seguros/use-eliminar-company'
import { useDebounce } from '@/hooks/use-debounce'
import { useState } from 'react'

import DialogFactoresCuotas from './dialog-factores-cuotas/dialog-factores-cuotas'
import DialogRegistrarCompany from './dialog-registrar-company/dialog-registrar-company'
import FiltrosCompanies from './panel-companies/filtros-companies'
import TablaCompanies from './panel-companies/tabla-companies'

const TAMANO_PAGINA = 10

type CompaniesClientProps = {
	initialData: ObtenerCompaniesSegurosResponse
}

export default function CompaniesClient({ initialData }: CompaniesClientProps) {
	const [pagina, setPagina] = useState<number>(1)
	const [inputBusqueda, setInputBusqueda] = useState('')
	const textoBusqueda = useDebounce(inputBusqueda, 300)

	const { data: companies, isFetching } = useCompaniesSegurosPaginado({
		initialData,
		textoBusqueda,
		pagina,
		tamanoPagina: TAMANO_PAGINA,
	})

	const eliminarMutation = useEliminarCompany()

	const [dialogRegistroAbierto, setDialogRegistroAbierto] = useState(false)
	const [companyAEditar, setCompanyAEditar] = useState<CompanySeguro | null>(
		null,
	)
	const [companyAFactores, setCompanyAFactores] = useState<CompanySeguro | null>(
		null,
	)
	const [companyAEliminar, setCompanyAEliminar] = useState<CompanySeguro | null>(
		null,
	)

	const abrirDialogCrear = () => {
		setCompanyAEditar(null)
		setDialogRegistroAbierto(true)
	}

	const abrirDialogRenombrar = (company: CompanySeguro) => {
		setCompanyAEditar(company)
		setDialogRegistroAbierto(true)
	}

	const cerrarDialogRegistro = () => {
		setDialogRegistroAbierto(false)
		setCompanyAEditar(null)
	}

	// Al cambiar de página con una búsqueda activa, la cuenta de la barra de
	// filtros corresponde a la página actual; el total real lo da la API.
	const total = companies?.total ?? 0
	const totalFiltrados = companies?.data.length ?? 0

	return (
		<PanelLayout>
			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-3 sm:p-4'>
					<FiltrosCompanies
						busqueda={inputBusqueda}
						onBusquedaChange={valor => {
							setInputBusqueda(valor)
							setPagina(1)
						}}
						total={total}
						totalFiltrados={totalFiltrados}
						onCrear={abrirDialogCrear}
					/>
				</div>

				<div className='p-3 sm:p-4'>
					<TablaCompanies
						companies={companies?.data ?? []}
						isFetching={isFetching && !companies}
						pagina={pagina}
						totalPaginas={companies?.total_paginas ?? 1}
						onPaginaChange={setPagina}
						onEditar={abrirDialogRenombrar}
						onFactores={setCompanyAFactores}
						onEliminar={setCompanyAEliminar}
					/>
				</div>
			</section>

			<DialogRegistrarCompany
				companyEdicion={companyAEditar ?? undefined}
				dialogAbierto={dialogRegistroAbierto}
				cerrarDialog={cerrarDialogRegistro}
			/>

			{companyAFactores && (
				<DialogFactoresCuotas
					key={companyAFactores.id}
					company={companyAFactores}
					cerrarDialog={() => setCompanyAFactores(null)}
				/>
			)}

			<ConfirmDialog
				open={companyAEliminar !== null}
				onOpenChange={open => {
					if (!open) setCompanyAEliminar(null)
				}}
				title='¿Eliminar compañía?'
				description={`${companyAEliminar?.nombre ?? ''} será marcada como eliminada y dejará de aparecer en el listado y en los selects de pólizas y cotizaciones.`}
				confirmText='Eliminar'
				onConfirm={() => {
					if (companyAEliminar) {
						eliminarMutation.mutate(companyAEliminar.id)
						setCompanyAEliminar(null)
					}
				}}
				isPending={eliminarMutation.isPending}
			/>
		</PanelLayout>
	)
}
