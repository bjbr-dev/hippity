import { Stream } from 'node:stream'

function objectToString(val: unknown): string {
  return Object.prototype.toString.call(val)
}

export function isArrayBufferView(val: unknown): val is ArrayBufferView {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(val)
  } else {
    return (
      val &&
      (val as ArrayBufferView).buffer &&
      (val as ArrayBufferView).buffer instanceof ArrayBuffer
    )
  }
}

export function isArrayBuffer(val: unknown): val is ArrayBuffer {
  return objectToString(val) === '[object ArrayBuffer]'
}

export function isFormData(val: unknown): val is FormData {
  return typeof FormData !== 'undefined' && val instanceof FormData
}

export function isFile(val: unknown): val is File {
  return objectToString(val) === '[object File]'
}

export function isBlob(val: unknown): val is Blob {
  return objectToString(val) === '[object Blob]'
}

export function isStream(val: unknown): val is Stream {
  return (
    val !== null &&
    typeof val === 'object' &&
    typeof (val as Stream).pipe === 'function'
  )
}

export function isURLSearchParams(val: unknown): val is URLSearchParams {
  return (
    typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
  )
}
