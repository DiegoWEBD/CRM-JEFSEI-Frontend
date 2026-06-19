import { Skeleton } from '@/components/skeleton'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'

export function PanelSolicitudesEstudioSkeleton() {
  return (
    <PanelLayout>
      <PanelHeader>
        <Skeleton className='h-7 w-56' />
      </PanelHeader>

      <div className='grid grid-cols-2 gap-2 lg:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5'>
            <Skeleton className='h-8 w-8 shrink-0 rounded-md' />
            <div className='min-w-0 flex-1 space-y-1.5'>
              <Skeleton className='h-3 w-28' />
              <Skeleton className='h-5 w-8' />
            </div>
          </div>
        ))}
      </div>

      <section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
        <div className='space-y-3 border-b border-border/80 p-3 sm:p-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Skeleton className='h-9 flex-1 rounded-md' />
            <Skeleton className='h-9 w-36 rounded-md' />
            <Skeleton className='h-9 w-36 rounded-md' />
            <Skeleton className='h-9 w-36 rounded-md' />
            <Skeleton className='h-9 w-36 rounded-md' />
          </div>
        </div>

        <div className='p-3 sm:p-4'>
          <div className='space-y-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex items-center gap-4'>
                <Skeleton className='h-4 flex-1' />
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-8 w-28' />
              </div>
            ))}
          </div>
        </div>
      </section>
    </PanelLayout>
  )
}
