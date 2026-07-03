'use client'

import { useState } from 'react'

export function useUfValue() {
  const [cargando, setCargando] = useState(false)

  const refrescar = async () => {
    setCargando(true)
    try {
      const res = await fetch('/api/indicadores/uf')
      const data = await res.json()
      if (typeof data.valor === 'number') {
        return data.valor
      }
    } catch {
      // silencioso: el usuario puede editar manualmente
    } finally {
      setCargando(false)
    }
    return null
  }

  return { cargando, refrescar }
}
