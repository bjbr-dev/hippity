/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

const toString = Object.prototype.toString

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
export function isArray(val) {
  return toString.call(val) === '[object Array]'
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
export function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]'
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
export function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
export function isArrayBufferView(val) {
  let result
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val)
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer
  }
  return result
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
export function isString(val) {
  return typeof val === 'string'
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
export function isNumber(val) {
  return typeof val === 'number'
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
export function isUndefined(val) {
  return typeof val === 'undefined'
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
export function isObject(val) {
  return val !== null && typeof val === 'object'
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
export function isDate(val) {
  return toString.call(val) === '[object Date]'
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
export function isFile(val) {
  return toString.call(val) === '[object File]'
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
export function isBlob(val) {
  return toString.call(val) === '[object Blob]'
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
export function isFunction(val) {
  return toString.call(val) === '[object Function]'
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
export function isStream(val) {
  return isObject(val) && isFunction(val.pipe)
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
export function isURLSearchParams(val) {
  return (
    typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
  )
}
