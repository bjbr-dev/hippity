import { basicAuth } from './basic-auth'

it('Does nothing if authorization already set', () => {
  const request = {
    headers: { authorization: 'foo' },
    auth: { username: 'foo', password: 'bar' }
  }

  const result = basicAuth()(request)

  expect(request).toEqual({
    headers: { authorization: 'foo' },
    auth: { username: 'foo', password: 'bar' }
  })
  expect(result).toBe(request)
})

it('Does nothing if auth not set', () => {
  const request = {}

  const result = basicAuth()(request)

  expect(request).toEqual({})
  expect(result).toBe(request)
})

it('Adds authorization header from request', () => {
  const request = { auth: { username: 'foo', password: 'bar' } }

  const result = basicAuth()(request)

  expect(request).toEqual({ auth: { username: 'foo', password: 'bar' } })
  expect(result).toEqual({ headers: { authorization: 'Basic Zm9vOmJhcg==' } })
})

it('Adds authorization header from default', () => {
  const request = {}

  const result = basicAuth({ username: 'foo', password: 'bar' })(request)

  expect(request).toEqual({})
  expect(result).toEqual({ headers: { authorization: 'Basic Zm9vOmJhcg==' } })
})

it('Allows request auth to override default', () => {
  const request = { auth: { username: 'foo', password: 'bar' } }

  const result = basicAuth({ username: 'bar', password: 'bar' })(request)

  expect(request).toEqual({ auth: { username: 'foo', password: 'bar' } })
  expect(result).toEqual({ headers: { authorization: 'Basic Zm9vOmJhcg==' } })
})
