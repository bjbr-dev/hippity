import { sendViaRequest } from './request'
import { sendViaXhr } from './xhr'
import { isNode } from '~/run-location'

export function sendMiddleware(request) {
  if (isNode) {
    return sendViaRequest(request)
  } else {
    return sendViaXhr(request)
  }
}
