import axios from 'axios'
import { toast } from 'sonner'

export const clientAxios = axios.create()

function instalarInterceptor(instancia: typeof axios | typeof clientAxios) {
  instancia.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          const url = error.config?.url || ''
          if (!url.startsWith('/api/auth/')) {
            window.location.replace('/api/auth/logout?redirect=/login')
          }
          return Promise.reject(error)
        }
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
}

instalarInterceptor(axios)
instalarInterceptor(clientAxios)
