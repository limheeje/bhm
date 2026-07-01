import {setupWorker} from 'msw/browser'
import {authHandlers} from '~/mocks/handlers/auth'

export const worker = setupWorker(...authHandlers)
