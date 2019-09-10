const objectToString = Object.prototype.toString

export function isArray(val) {
  return Array.isArray(val)
}

export function isArrayBuffer(val) {
  return objectToString.call(val) === '[object ArrayBuffer]'
}

export function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData
}

export function isArrayBufferView(val) {
  let result
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val)
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer
  }
  return result
}

export function isString(val) {
  return typeof val === 'string'
}

export function isNumber(val) {
  return typeof val === 'number'
}

export function isUndefined(val) {
  return typeof val === 'undefined'
}

export function isObject(val) {
  return val !== null && typeof val === 'object'
}

export function isDate(val) {
  return objectToString.call(val) === '[object Date]'
}

export function isFile(val) {
  return objectToString.call(val) === '[object File]'
}

export function isBlob(val) {
  return objectToString.call(val) === '[object Blob]'
}

export function isFunction(val) {
  return objectToString.call(val) === '[object Function]'
}

export function isStream(val) {
  return isObject(val) && isFunction(val.pipe)
}

export function isURLSearchParams(val) {
  return (
    typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
  )
}
