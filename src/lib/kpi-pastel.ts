export type KpiPastelColor =
	| 'info'
	| 'success'
	| 'primary'
	| 'warning'
	| 'danger'
	| 'sky'
	| 'violet'
	| 'slate'

type KpiPastelClasses = {
	card: string
	icon: string
}

export const KPI_PASTEL: Record<KpiPastelColor, KpiPastelClasses> = {
	info: {
		card: 'border-sky-300 bg-sky-100 dark:border-sky-900/70 dark:bg-sky-950/50',
		icon: 'bg-sky-200 text-sky-800 ring-sky-300 dark:bg-sky-950/60 dark:text-sky-200 dark:ring-sky-900/80',
	},
	success: {
		card: 'border-emerald-300 bg-emerald-100 dark:border-emerald-900/70 dark:bg-emerald-950/50',
		icon: 'bg-emerald-200 text-emerald-800 ring-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:ring-emerald-900/80',
	},
	primary: {
		card: 'border-blue-300 bg-blue-100 dark:border-blue-900/70 dark:bg-blue-950/50',
		icon: 'bg-blue-200 text-blue-800 ring-blue-300 dark:bg-blue-950/60 dark:text-blue-200 dark:ring-blue-900/80',
	},
	warning: {
		card: 'border-amber-300 bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/50',
		icon: 'bg-amber-200 text-amber-800 ring-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:ring-amber-900/80',
	},
	danger: {
		card: 'border-red-300 bg-red-100 dark:border-red-900/70 dark:bg-red-950/50',
		icon: 'bg-red-200 text-red-800 ring-red-300 dark:bg-red-950/60 dark:text-red-200 dark:ring-red-900/80',
	},
	sky: {
		card: 'border-sky-300 bg-sky-100 dark:border-sky-900/70 dark:bg-sky-950/50',
		icon: 'bg-sky-200 text-sky-800 ring-sky-300 dark:bg-sky-950/60 dark:text-sky-200 dark:ring-sky-900/80',
	},
	violet: {
		card: 'border-violet-300 bg-violet-100 dark:border-violet-900/70 dark:bg-violet-950/50',
		icon: 'bg-violet-200 text-violet-800 ring-violet-300 dark:bg-violet-950/60 dark:text-violet-200 dark:ring-violet-900/80',
	},
	slate: {
		card: 'border-slate-300 bg-slate-200 dark:border-slate-700 dark:bg-slate-800',
		icon: 'bg-slate-300 text-slate-800 ring-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:ring-slate-600',
	},
}