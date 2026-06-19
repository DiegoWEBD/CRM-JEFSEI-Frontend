import { Skeleton } from '@/components/skeleton'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'

function SectionSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-6 w-28' />
        <Skeleton className='h-6 w-32 rounded-md' />
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <Skeleton className='h-28 rounded-lg' />
        <div className='lg:col-span-2'>
          <Skeleton className='h-28 rounded-lg' />
        </div>
      </div>
      <Skeleton className='h-72 rounded-lg' />
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <Skeleton className='h-72 rounded-lg' />
        <Skeleton className='h-72 rounded-lg' />
        <Skeleton className='h-72 rounded-lg' />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <PanelLayout>
      <PanelHeader>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-7 w-32' />
          <Skeleton className='h-4 w-48' />
        </div>
      </PanelHeader>

      <div className='space-y-8'>
        <SectionSkeleton />
        <Skeleton className='h-px w-full' />
        <SectionSkeleton />
        <Skeleton className='h-px w-full' />
        <SectionSkeleton />
        <Skeleton className='h-px w-full' />
        <SectionSkeleton />
      </div>
    </PanelLayout>
  )
}
