import { Skeleton } from '@/components/skeleton'

export function SkeletonTabla() {
  return (
    <div className='space-y-2'>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className='flex items-center gap-4 py-2'>
          <Skeleton className='h-5 w-5 shrink-0 rounded-full' />
          <Skeleton className='h-4 flex-1' />
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-32' />
        </div>
      ))}
    </div>
  )
}
