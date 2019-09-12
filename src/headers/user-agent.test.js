import { userAgent } from './user-agent'

it.each(['user-agent', 'User-Agent'])(
  'Does nothing if user-agent already set',
  name => {
    const request = { headers: { [name]: 'value' } }

    const result = userAgent()(request)

    expect(request).toEqual({ headers: { [name]: 'value' } })
    expect(result).toEqual({ headers: { [name]: 'value' } })
  }
)

it('Adds in default user agent', () => {
  const request = {}

  const result = userAgent()(request)

  expect(request).toEqual({})
  expect(result).toEqual({ headers: { 'user-agent': 'hippity/unknown' } })
})

it('Uses configured userAgent', () => {
  const request = {}

  const result = userAgent('overriden')(request)

  expect(request).toEqual({})
  expect(result).toEqual({ headers: { 'user-agent': 'overriden' } })
})

it('Allows other headers', () => {
  const request = { headers: { foo: 'bar' } }

  const result = userAgent()(request)

  expect(request).toEqual({ headers: { foo: 'bar' } })
  expect(result).toEqual({
    headers: { foo: 'bar', 'user-agent': 'hippity/unknown' }
  })
})
