import { MessageSquareText } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'

const SECTION_TITLE =
  'text-sm font-semibold leading-tight tracking-tight text-foreground'

type ObservacionesComercialesSectionProps = {
  observaciones?: string | null
}

export default function ObservacionesComercialesSection({
  observaciones,
}: ObservacionesComercialesSectionProps) {
  return (
    <Card className='border-border bg-card shadow-none'>
      <CardHeader className='border-b border-border pb-2 pt-3'>
        <CardTitle
          className={`${SECTION_TITLE} flex items-center gap-2`}
        >
          <MessageSquareText className='h-4 w-4 text-muted-foreground' aria-hidden />
          Observaciones comerciales
        </CardTitle>
      </CardHeader>
      <CardContent className='p-3'>
        {observaciones?.trim() ? (
          <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
            {observaciones}
          </p>
        ) : (
          <p className='text-xs text-muted-foreground'>
            Sin observaciones registradas para este cliente.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
