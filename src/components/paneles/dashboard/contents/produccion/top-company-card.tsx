import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Trophy } from 'lucide-react'

type TopCompanyCardProps = {
  nombre: string
  prima_neta: number
}

export default function TopCompanyCard({ nombre, prima_neta }: TopCompanyCardProps) {
  return (
    <Card className='border-primary/20 bg-primary/5'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
          <Trophy className='h-4 w-4 text-amber-500' />
          Compañía Destacada del Mes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-lg font-bold'>{nombre}</p>
        <p className='text-sm text-muted-foreground'>
          {prima_neta.toLocaleString('es-CL')} UF en primas
        </p>
      </CardContent>
    </Card>
  )
}
