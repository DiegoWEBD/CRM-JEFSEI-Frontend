import { Skeleton } from '@/components/skeleton'

export function SkeletonTabla() {
  return (
    <>
      <div className='space-y-3 lg:hidden'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='rounded-lg border border-border bg-card p-4'
          >
            <div className='flex items-start justify-between gap-2'>
              <div className='min-w-0 flex-1 space-y-1'>
                <Skeleton className='h-4 w-40' />
                <Skeleton className='h-3 w-28' />
              </div>
              <Skeleton className='h-4 w-4 shrink-0' />
            </div>
            <div className='mt-3 flex flex-wrap items-center gap-2'>
              <Skeleton className='h-5 w-20 rounded-full' />
              <Skeleton className='h-5 w-12 rounded-full' />
            </div>
            <div className='mt-2 flex items-center justify-between'>
              <Skeleton className='h-3 w-32' />
              <Skeleton className='h-3 w-24' />
            </div>
          </div>
        ))}
      </div>

      <div className='hidden lg:block'>
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-4 border-b border-border/40 px-3 py-2'>
              <Skeleton className='h-4 flex-1' />
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-8 w-48' />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
