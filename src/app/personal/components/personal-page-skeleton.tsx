import { Skeleton } from '@/components/skeleton'
import { Card } from '@/components/card'

export function PersonalPageSkeleton() {
  return (
    <div>
      <Skeleton className='h-8 w-48 mb-6' />
      <div className='space-y-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className='flex items-center gap-4 p-4'>
            <Skeleton className='h-9 w-9 rounded-full' />
            <Skeleton className='h-4 w-40' />
          </Card>
        ))}
      </div>
    </div>
  )
}
