function objectToString(val) {
  return Object.prototype.toString.call(val)
}

export function isArrayBufferView(val) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(val)
  } else {
    return val && val.buffer && val.buffer instanceof ArrayBuffer
  }
}

export function isArrayBuffer(val) {
  return objectToString(val) === '[object ArrayBuffer]'
}

export function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData
}

export function isFile(val) {
  return objectToString(val) === '[object File]'
}

export function isBlob(val) {
  return objectToString(val) === '[object Blob]'
}

export function isStream(val) {
  return (
    val !== null && typeof val === 'object' && typeof val.pipe === 'function'
  )
}

export function isURLSearchParams(val) {
  return (
    typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
  )
}
