export interface PermisoJson {
	codigo: string
	descripcion: string
	nombre: string
}

export interface RolConPermisosJson {
	codigo: string
	nombre: string
	permisos: PermisoJson[]
}

export interface ObtenerRolesConPermisosResponse {
	data: RolConPermisosJson[]
}
