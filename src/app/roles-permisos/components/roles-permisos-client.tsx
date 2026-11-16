'use client'

import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs'
import { useState } from 'react'
import PermisosPorRol from './permisos-por-rol'
import RolesDeUsuarios from './roles-de-usuarios'

type TabPanel = 'permisos-rol' | 'roles-usuario'

export default function RolesPermisosClient() {
	const [tab, setTab] = useState<TabPanel>('permisos-rol')

	return (
		<PanelLayout>
			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-3 sm:p-4'>
					<Tabs value={tab} onValueChange={valor => setTab(valor as TabPanel)}>
						<TabsList>
							<TabsTrigger value='permisos-rol'>Permisos por rol</TabsTrigger>
							<TabsTrigger value='roles-usuario'>Roles de usuarios</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div className='p-3 sm:p-4'>
					{tab === 'permisos-rol' ? <PermisosPorRol /> : <RolesDeUsuarios />}
				</div>
			</section>
		</PanelLayout>
	)
}
