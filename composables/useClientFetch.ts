const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  params?: object
): Promise<T> => {
  const config = useRuntimeConfig()
  const isClient = import.meta.client
  const isBodyMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)
  const _$fetch = () =>
    $fetch<T>(url, {
      method,
      baseURL: config.public.apiBaseURL,
      ...(isBodyMethod ? {body: params} : {params}),
      onRequest({options}) {
        const token = getCookie('accessToken')
        if (token) {
          if (!options.headers) options.headers = new Headers()
          if (options.headers) {
            options.headers.set('Authorization', `Bearer ${token}`)
          }
        }
      }
    })
  try {
    return await _$fetch()
  } catch (err) {
    const {response} = err as Record<string, any>
    console.dir(response)
    if (
      response &&
      isClient &&
      (response.status === 401 || response.status === 403) &&
      !['/auth/refresh', '/auth/login'].includes(url)
    ) {
      const authStore = useAuthStore()
      const refreshed = await $fetch('/auth/refresh', {
        method: 'POST',
        baseURL: config.public.apiBaseURL,
        credentials: 'include'
      })
      console.log('☆☆☆☆☆☆refreshed---', refreshed)

      if (refreshed) {
        return await _$fetch()
      }
      //리프레시토큰 실패
      authStore.setLogout()
      if (isClient) navigateTo('/login')
      return new Promise(() => {})
    }
    throw err
  }
}
export const useClientFetch = {
  get: async <T>(url: string, params?: object): Promise<T> => request<T>('GET', url, params),
  post: async <T>(url: string, params?: object): Promise<T> => request<T>('POST', url, params),
  put: async <T>(url: string, params?: object): Promise<T> => request<T>('PUT', url, params),
  delete: async <T>(url: string, params?: object): Promise<T> => request<T>('DELETE', url, params),
  patch: async <T>(url: string, params?: object): Promise<T> => request<T>('PATCH', url, params)
}
