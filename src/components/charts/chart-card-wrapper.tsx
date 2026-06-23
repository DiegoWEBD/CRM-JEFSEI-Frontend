import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { ReactNode } from 'react'

type ChartCardWrapperProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export default function ChartCardWrapper({
  title,
  description,
  children,
  className,
}: ChartCardWrapperProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='text-sm font-semibold'>{title}</CardTitle>
        {description && (
          <CardDescription className='text-xs'>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
