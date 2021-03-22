import { requestTerminator } from './request-terminator'
import { xhrTerminator } from './xhr-terminator'
import { isNode } from 'browser-or-node'
import { HippityTerminator } from '~/client'

export function sendTerminator(): HippityTerminator {
  if (isNode) {
    return requestTerminator
  } else {
    return xhrTerminator
  }
}
