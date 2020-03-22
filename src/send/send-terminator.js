import { requestTerminator } from './request-terminator'
import { xhrTerminator } from './xhr-terminator'
import { isNode } from 'browser-or-node'

export function sendTerminator() {
  if (isNode) {
    return requestTerminator
  } else {
    return xhrTerminator
  }
}
