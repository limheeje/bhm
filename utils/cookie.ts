const isClient = import.meta.client

export const setCookie = (name: string, value: string, expireSec: number) => {
  if (isClient) {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};path=/;Max-Age=${expireSec};`
  }
}

export const getCookie = (key: string) => {
  return useCookie(key).value
}

export const removeCookie = (name: string) => {
  if (isClient) {
    document.cookie = `${encodeURIComponent(name)}=;path=/;Max-Age=0;`
    document.cookie = `${encodeURIComponent(name)}=;path=/;Max-Age=0;`
  }
}
