import { HippityRequest } from '../client'

type RouteValuePrimitive = string | number | boolean

type RouteValue =
  | RouteValues
  | RouteValues[]
  | RouteValuePrimitive
  | RouteValuePrimitive[]

export type RouteValues = { [key: string]: RouteValue }

export type RouteTemplate = [string, (RouteValues | null)?]

export function urlResolver(
  request: HippityRequest<string | RouteTemplate>
): HippityRequest<string> {
  const template = request.url
  if (Array.isArray(template)) {
    return {
      ...request,
      url: resolve(template),
    }
  } else {
    return request as HippityRequest<string>
  }
}

function buildParams(
  key: string,
  value: RouteValue,
  add: (key: string, value: RouteValuePrimitive) => void
) {
  if (typeof value === 'undefined') {
    return
  }

  if (value !== null && typeof value === 'object') {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        buildParams(`${key}[${i}]`, value[i], add)
      }
    } else {
      for (const subKey in value) {
        if (Object.prototype.hasOwnProperty.call(value, subKey)) {
          buildParams(`${key}.${subKey}`, value[subKey], add)
        }
      }
    }
  } else {
    add(key, value as RouteValuePrimitive)
  }
}

export function resolve([path, params]: RouteTemplate): string {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string')
  }

  if (typeof params === 'undefined' || params === null) {
    return path
  }

  const queryParameters = []
  const pushQueryParameter = function (
    key: string,
    value: RouteValuePrimitive
  ) {
    queryParameters.push(
      encodeURIComponent(key) +
        '=' +
        encodeURIComponent(value == null ? '' : value.toString())
    )
  }

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key]
      const placeholder = `{${key}}`

      if (path.indexOf(placeholder) >= 0) {
        do {
          path = path.replace(
            placeholder,
            encodeURIComponent(value as RouteValuePrimitive)
          )
        } while (path.indexOf(placeholder) >= 0)
      } else {
        buildParams(key, value, pushQueryParameter)
      }
    }
  }

  if (queryParameters.length === 0) {
    return path
  }

  // Check if the url already has a query string
  return path + (path.indexOf('?') < 0 ? '?' : '&') + queryParameters.join('&')
}
