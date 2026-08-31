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
		card: 'border-l-2 border-l-info bg-info/5',
		icon: 'bg-info/10 text-info ring-info/15',
	},
	success: {
		card: 'border-l-2 border-l-success bg-success/5',
		icon: 'bg-success/10 text-success ring-success/15',
	},
	primary: {
		card: 'border-l-2 border-l-primary bg-primary/5',
		icon: 'bg-primary/10 text-primary ring-primary/15',
	},
	warning: {
		card: 'border-l-2 border-l-warning bg-warning/5',
		icon: 'bg-warning/10 text-warning ring-warning/15',
	},
	danger: {
		card: 'border-l-2 border-l-destructive bg-destructive/5',
		icon: 'bg-destructive/10 text-destructive ring-destructive/15',
	},
	sky: {
		card: 'border-l-2 border-l-info bg-info/5',
		icon: 'bg-info/10 text-info ring-info/15',
	},
	violet: {
		card: 'border-l-2 border-l-primary bg-primary/5',
		icon: 'bg-primary/10 text-primary ring-primary/15',
	},
	slate: {
		card: 'border-l-2 border-l-border/50 bg-muted/50',
		icon: 'bg-muted text-muted-foreground ring-border/40',
	},
}
