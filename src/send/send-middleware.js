import { sendViaHttpAgent } from './request'
import { sendViaXhr } from './xhr'

const sender = (function() {
  // Only Node.JS has a process variable that is of [[Class]] process
  if (
    typeof process !== 'undefined' &&
    Object.prototype.toString.call(process) === '[object process]'
  ) {
    return sendViaHttpAgent
  } else if (typeof XMLHttpRequest !== 'undefined') {
    return sendViaXhr
  }

  throw new Error('Could not choose a sender')
})()

export function sendMiddleware(request) {
  return sender(request)
}
