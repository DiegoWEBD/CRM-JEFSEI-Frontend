import { Card, CardContent, CardHeader } from '@/components/card'
import { Skeleton } from '@/components/skeleton'

export function CardProspectosSkeleton() {
  return (
    <Card className='border-border bg-card shadow-none'>
      <CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
        <Skeleton className='h-5 w-44' />
        <div className='flex shrink-0 flex-wrap gap-1.5'>
          <Skeleton className='h-9 w-28 rounded-md' />
          <Skeleton className='h-9 w-28 rounded-md' />
        </div>
      </CardHeader>
      <CardContent className='space-y-3 p-4'>
        <Skeleton className='h-9 w-full rounded-md' />
        <div className='flex flex-wrap gap-1.5'>
          <Skeleton className='h-7 w-16 rounded-full' />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-7 w-20 rounded-full' />
          ))}
          <Skeleton className='h-7 w-28 rounded-full' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-3 w-32' />
          <div className='max-h-[52vh] divide-y divide-border overflow-hidden rounded-md border border-border'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex items-center justify-between gap-3 px-3 py-3'>
                <div className='min-w-0 flex-1 space-y-1.5'>
                  <div className='flex gap-1.5'>
                    <Skeleton className='h-4 w-16 rounded-full' />
                    <Skeleton className='h-4 w-24 rounded-full' />
                  </div>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-3 w-1/2' />
                </div>
                <Skeleton className='h-8 w-14 rounded-md' />
              </div>
            ))}
          </div>
        </div>
        <Skeleton className='h-10 w-full rounded-lg' />
      </CardContent>
    </Card>
  )
}