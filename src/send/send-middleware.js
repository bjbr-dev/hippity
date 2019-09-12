import { sendViaRequest } from './request'
import { sendViaXhr } from './xhr'
import { isNode } from 'browser-or-node'

export function sendMiddleware(request) {
  if (isNode) {
    return sendViaRequest(request)
  } else {
    return sendViaXhr(request)
  }
}
