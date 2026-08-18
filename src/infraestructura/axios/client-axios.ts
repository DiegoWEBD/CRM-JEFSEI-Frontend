import axios from 'axios'

export const clientAxios = axios.create()

function instalarInterceptor(instancia: typeof axios | typeof clientAxios) {
  instancia.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          const url = error.config?.url || ''
          if (!url.startsWith('/api/auth/')) {
            window.dispatchEvent(new Event('session-expired'))
            window.location.replace('/api/auth/logout?redirect=/login')
          }
        }
      }

      return Promise.reject(error)
    },
  )
}

instalarInterceptor(axios)
instalarInterceptor(clientAxios)
