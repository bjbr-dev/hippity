import { requestTerminator } from './request'
import { xhrTerminator } from './xhr'
import { isNode } from 'browser-or-node'

export function sendTerminator() {
  if (isNode) {
    return requestTerminator
  } else {
    return xhrTerminator
  }
}
