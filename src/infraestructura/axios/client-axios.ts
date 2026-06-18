import axios from 'axios'
import { toast } from 'sonner'

export const clientAxios = axios.create()

clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.error
          || error.response?.data?.detail
          || 'Ha ocurrido un error inesperado',
      )
    } else {
      toast.error(error?.message || 'Ha ocurrido un error inesperado')
    }

    return Promise.reject(error)
  },
)
