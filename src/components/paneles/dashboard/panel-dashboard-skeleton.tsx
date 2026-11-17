import { Skeleton } from '@/components/skeleton'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'

function SectionSkeleton({ alto = 520 }: { alto?: number }) {
  return (
    <div className='space-y-3 rounded-xl border border-border/80 bg-muted/[0.02] p-3.5 pt-4 sm:p-4'>
      <Skeleton className='h-5 w-40' />
      <Skeleton className='h-3 w-64' />
      <div style={{ minHeight: alto }}>
        <Skeleton className='h-full min-h-[inherit] w-full rounded-lg' />
      </div>
    </div>
  )
}

/**
 * Skeleton del dashboard: refleja el layout real (barra de filtros sticky,
 * fila de indicadores clave, pipeline, producción/gestiones en dos columnas
 * y reportes de pólizas).
 */
export function DashboardSkeleton() {
  return (
    <div>
      <div className='-mx-3 border-b border-border/60 px-3 pb-3 pt-2.5 lg:-mx-8 lg:px-8'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-8 w-35 rounded-md' />
          <Skeleton className='h-8 w-25 rounded-md' />
        </div>
      </div>

      <PanelLayout>
        <div className='space-y-3 pt-1'>
          <Skeleton className='h-5 w-36' />
          <div className='grid grid-cols-2 gap-2.5 lg:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-24 rounded-lg' />
            ))}
          </div>
        </div>

        <SectionSkeleton alto={300} />

        <div className='grid gap-8 lg:grid-cols-2 lg:items-start'>
          <SectionSkeleton alto={640} />
          <SectionSkeleton alto={480} />
        </div>

        <SectionSkeleton alto={520} />
      </PanelLayout>
    </div>
  )
}
