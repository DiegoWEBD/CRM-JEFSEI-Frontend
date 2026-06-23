import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

type CrearProcesoComercialRequest = {
  id_prospecto: number
  tipo: string
}

export const useCrearProcesoComercial = (idProspecto: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: CrearProcesoComercialRequest) => {
      const response = await axios.post('/api/procesos-comerciales', request)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['procesos-comerciales', idProspecto],
      })
    },
  })
}
