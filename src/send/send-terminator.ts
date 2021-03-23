import { requestTerminator } from './request-terminator'
import { xhrTerminator } from './xhr-terminator'
import { isNode } from 'browser-or-node'
import { HippityMiddleware } from '~/client'

export function sendTerminator(): HippityMiddleware {
  if (isNode) {
    return requestTerminator
  } else {
    return xhrTerminator
  }
}
