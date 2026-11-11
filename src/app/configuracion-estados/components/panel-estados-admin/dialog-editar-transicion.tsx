'use client'

import { EstadoConfiguracion } from '@/aplicacion/estados-admin/dto/estado-configuracion'
import { TransicionAdmin } from '@/aplicacion/estados-admin/dto/transicion-admin'
import { Button } from '@/components/button'
import { Checkbox } from '@/components/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { ScrollArea } from '@/components/scroll-area'
import { Skeleton } from '@/components/skeleton'
import { Switch } from '@/components/switch'
import { useActualizarTransicion } from '@/hooks/estados-admin/use-actualizar-transicion'
import { RolJson, useObtenerRoles } from '@/hooks/roles/use-obtener-roles'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import * as Yup from 'yup'

type DialogEditarTransicionProps = {
	/** Estado de origen de la transición. */
	estado: EstadoConfiguracion
	/** Transición a editar. */
	transicion: TransicionAdmin
	dialogAbierto: boolean
	cerrarDialog: () => void
}

type SelectorResponsablesProps = {
	label: string
	descripcion: string
	roles: RolJson[]
	seleccionados: string[]
	alternar: (codigo: string, marcado: boolean) => void
	cargando: boolean
}

/**
 * Lista de checkboxes con los roles responsables de las alertas SLA de la
 * transición para un tipo de oportunidad (nueva o de renovación). Puede
 * haber más de un responsable por tipo.
 */
function SelectorResponsables({
	label,
	descripcion,
	roles,
	seleccionados,
	alternar,
	cargando,
}: SelectorResponsablesProps) {
	return (
		<div className='space-y-2'>
			<Label>{label}</Label>
			<div
				role='group'
				aria-label={label}
				className='rounded-lg border border-border'
			>
				<ScrollArea className='max-h-45 overflow-y-auto'>
					<div className='space-y-2 p-3'>
						{cargando ? (
							<>
								<Skeleton className='h-5 w-full' />
								<Skeleton className='h-5 w-full' />
								<Skeleton className='h-5 w-full' />
							</>
						) : roles.length === 0 ? (
							<p className='text-xs text-muted-foreground'>
								No hay roles disponibles.
							</p>
						) : (
							roles.map(rol => (
								<label
									key={rol.codigo}
									className='flex cursor-pointer items-center gap-2'
								>
									<Checkbox
										checked={seleccionados.includes(rol.codigo)}
										onCheckedChange={marcado =>
											alternar(rol.codigo, marcado === true)
										}
									/>
									<span className='text-sm'>{rol.nombre}</span>
								</label>
							))
						)}
					</div>
				</ScrollArea>
			</div>
			<p className='text-xs text-muted-foreground'>{descripcion}</p>
		</div>
	)
}

/**
 * Edita una transición.
 *
 * - Secundaria: es_manual y acción requerida.
 * - Principal: sus días límite (SLA) y sus responsables de alertas, por
 *   tipo de oportunidad (nueva o de renovación); es_manual y la acción
 *   requerida quedan reservadas al flujo feliz y no se tocan.
 */
export default function DialogEditarTransicion({
	estado,
	transicion,
	dialogAbierto,
	cerrarDialog,
}: DialogEditarTransicionProps) {
	const actualizarMutation = useActualizarTransicion()
	const rolesQuery = useObtenerRoles()
	const esPrincipal = transicion.es_principal

	const roles = useMemo(() => rolesQuery.data || [], [rolesQuery])
	const validationSchema = Yup.object({
		esManual: Yup.boolean(),
		accionRequerida: Yup.string().max(
			250,
			'La acción requerida no puede superar los 250 caracteres',
		),
		diasLimite: Yup.string()
			.trim()
			.test(
				'entero-no-negativo',
				'Los días límite deben ser un número entero no negativo',
				value => !value || /^\d+$/.test(value),
			),
	})

	const formik = useFormik({
		initialValues: {
			esManual: transicion.es_manual,
			accionRequerida: transicion.accion_requerida ?? '',
			diasLimite:
				transicion.dias_limite === null || transicion.dias_limite === undefined
					? ''
					: String(transicion.dias_limite),
			rolesNuevas: transicion.roles_responsables_nuevas ?? [],
			rolesRenovacion: transicion.roles_responsables_renovacion ?? [],
		},
		validationSchema,
		enableReinitialize: true,
		onSubmit: async (values, helpers) => {
			try {
				await actualizarMutation.mutateAsync({
					codigo_estado_origen: transicion.codigo_estado_origen,
					codigo_estado_destino: transicion.codigo_estado_destino,
					// En la principal estos campos no cambian: se reenvían intactos.
					es_manual: esPrincipal ? transicion.es_manual : values.esManual,
					accion_requerida: esPrincipal
						? transicion.accion_requerida
						: values.accionRequerida.trim()
							? values.accionRequerida.trim()
							: null,
					dias_limite: esPrincipal
						? values.diasLimite
							? Number(values.diasLimite)
							: null
						: null,
					// Los responsables solo aplican a la transición principal;
					// en las secundarias no se envían.
					roles_responsables_nuevas: esPrincipal
						? values.rolesNuevas
						: undefined,
					roles_responsables_renovacion: esPrincipal
						? values.rolesRenovacion
						: undefined,
				})
				cerrarDialog()
			} catch {
				// El error ya se notifica globalmente (MutationCache onError).
				helpers.setSubmitting(false)
			}
		},
	})

	const alternarRol = (
		campo: 'rolesNuevas' | 'rolesRenovacion',
		codigo: string,
		marcado: boolean,
	) => {
		const actuales = formik.values[campo]
		formik.setFieldValue(
			campo,
			marcado ? [...actuales, codigo] : actuales.filter(rol => rol !== codigo),
		)
	}

	return (
		<Dialog open={dialogAbierto} onOpenChange={open => !open && cerrarDialog()}>
			<DialogContent className='max-h-[90vh] overflow-y-auto'>
				<DialogTitle>
					{esPrincipal
						? 'Configurar transición principal'
						: 'Editar transición'}
				</DialogTitle>
				<DialogDescription>
					{`«${estado.nombre}» → «${transicion.nombre_estado_destino}»`}
				</DialogDescription>

				<form onSubmit={formik.handleSubmit} className='space-y-4'>
					{esPrincipal ? (
						<>
							<div className='space-y-2'>
								<Label htmlFor='diasLimite'>Días límite (SLA)</Label>
								<Input
									id='diasLimite'
									name='diasLimite'
									type='number'
									min={0}
									step={1}
									value={formik.values.diasLimite}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder='Sin límite'
								/>
								<p className='text-xs text-muted-foreground'>
									Cantidad máxima de días que una oportunidad puede permanecer
									en «{estado.nombre}» antes de generar alertas SLA. Déjalo
									vacío para no tener límite.
								</p>
								{formik.touched.diasLimite && formik.errors.diasLimite && (
									<p className='text-xs text-destructive'>
										{formik.errors.diasLimite}
									</p>
								)}
							</div>

							<SelectorResponsables
								label='Responsables — Oportunidades nuevas'
								descripcion='Roles que reciben las alertas SLA cuando la oportunidad no es de renovación. Puede haber más de un responsable.'
								roles={roles}
								seleccionados={formik.values.rolesNuevas}
								alternar={(codigo, marcado) =>
									alternarRol('rolesNuevas', codigo, marcado)
								}
								cargando={rolesQuery.isLoading}
							/>

							<SelectorResponsables
								label='Responsables — Oportunidades de renovación'
								descripcion='Roles que reciben las alertas SLA cuando la oportunidad es de renovación. Puede haber más de un responsable.'
								roles={roles}
								seleccionados={formik.values.rolesRenovacion}
								alternar={(codigo, marcado) =>
									alternarRol('rolesRenovacion', codigo, marcado)
								}
								cargando={rolesQuery.isLoading}
							/>
						</>
					) : (
						<>
							<div className='flex items-center justify-between gap-3 rounded-lg border border-border p-3'>
								<div className='min-w-0'>
									<Label htmlFor='esManual'>Transición manual</Label>
									<p className='text-xs text-muted-foreground'>
										El ejecutivo la dispara desde la oportunidad.
									</p>
								</div>
								<Switch
									id='esManual'
									checked={formik.values.esManual}
									onCheckedChange={valor =>
										formik.setFieldValue('esManual', valor)
									}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='accionRequerida'>Acción requerida</Label>
								<Input
									id='accionRequerida'
									name='accionRequerida'
									value={formik.values.accionRequerida}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!formik.values.esManual}
									placeholder='Ej: cargar cotizaciones'
								/>
								<p className='text-xs text-muted-foreground'>
									Texto que se muestra al ejecutivo como indicación de la
									transición.
								</p>
								{formik.touched.accionRequerida &&
									formik.errors.accionRequerida && (
										<p className='text-xs text-destructive'>
											{formik.errors.accionRequerida}
										</p>
									)}
							</div>
						</>
					)}

					<div className='flex justify-end gap-2'>
						<Button type='button' variant='outline' onClick={cerrarDialog}>
							Cancelar
						</Button>
						<Button
							type='submit'
							disabled={formik.isSubmitting || !formik.isValid}
						>
							{formik.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
