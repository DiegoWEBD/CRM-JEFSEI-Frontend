import { Suspense } from 'react'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import { PolizaPageSkeleton } from './poliza-page-skeleton'
import { PolizaPageClient } from './poliza-page-client'

type PolizaPageProps = {
  params: Promise<{ numeroPoliza: string }>
}

export default async function PolizaPage({ params }: PolizaPageProps) {
  const { numeroPoliza } = await params

  return (
    <AuthGuard fallback={null}>
      <Suspense fallback={<PolizaPageSkeleton />}>
        <PolizaPageClient numeroPoliza={numeroPoliza} />
      </Suspense>
    </AuthGuard>
  )
}
