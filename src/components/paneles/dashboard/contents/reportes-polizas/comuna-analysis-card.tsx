import { ItemCantidad } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import DonutChartWidget from '@/components/charts/donut-chart-widget'
import BarChartWidget from '@/components/charts/bar-chart-widget'

type ComunaAnalysisCardProps = {
  comunaNombre: string
  porSexo: ItemCantidad[]
  porRamo: ItemCantidad[]
}

export default function ComunaAnalysisCard({
  comunaNombre,
  porSexo,
  porRamo,
}: ComunaAnalysisCardProps) {
  return (
    <Card className='border-primary/20'>
      <CardHeader>
        <CardTitle className='text-sm font-semibold'>
          Análisis por Comuna: {comunaNombre}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <div>
            <p className='mb-2 text-xs font-medium text-muted-foreground'>
              Distribución por Sexo
            </p>
            <DonutChartWidget
              data={porSexo}
              nameKey='nombre'
              dataKey='cantidad'
              height={200}
              innerRadius={45}
              outerRadius={80}
            />
          </div>
          <div>
            <p className='mb-2 text-xs font-medium text-muted-foreground'>
              Pólizas por Ramo
            </p>
            <BarChartWidget
              data={porRamo}
              xKey='nombre'
              bars={[{ key: 'cantidad' }]}
              height={200}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
