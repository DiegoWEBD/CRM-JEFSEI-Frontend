'use client'

import { Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/card'

type TopCompanyCardProps = {
  nombre: string | null
  prima_neta: number | null
}

export default function TopCompanyCard({ nombre, prima_neta }: TopCompanyCardProps) {
  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <div className='flex items-start justify-between gap-2'>
          <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
            CompaÃ±Ã­a principal
          </p>
          <Building2 className='h-3.5 w-3.5 shrink-0 text-primary/70' aria-hidden />
        </div>
        {nombre ? (
          <>
            <p className='mt-1 text-base font-semibold tracking-tight text-foreground'>{nombre}</p>
            <p className='mt-0.5 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
              {prima_neta?.toLocaleString('es-CL')} UF
            </p>
          </>
        ) : (
          <p className='mt-2 text-xs text-muted-foreground'>No hay datos disponibles para este perÃ­odo</p>
        )}
      </CardContent>
    </Card>
  )
}
