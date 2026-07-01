export default defineNuxtPlugin(async () => {
  if (!import.meta.dev) return

  const {worker} = await import('~/mocks/browser')
  await worker.start({onUnhandledRequest: 'bypass'})
})
