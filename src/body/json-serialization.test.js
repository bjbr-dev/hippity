import { jsonSerializer, jsonDeserializer } from './json-serialization'

describe('jsonSerializer', () => {
  it('does nothing if content-type already set', () => {
    const request = { headers: { 'content-type': 'foo' }, body: { foo: 'bar' } }

    const response = jsonSerializer(request)

    expect(request).toEqual({
      headers: { 'content-type': 'foo' },
      body: { foo: 'bar' }
    })
    expect(response).toBe(request)
  })

  it('Serializes to json', () => {
    const request = { headers: { foo: 'bar' }, body: { foo: 'bar' } }

    const response = jsonSerializer(request)

    expect(request).toEqual({ headers: { foo: 'bar' }, body: { foo: 'bar' } })
    expect(response).toEqual({
      headers: {
        foo: 'bar',
        'content-type': 'application/json;charset=utf-8'
      },
      body: '{"foo":"bar"}'
    })
  })
})

describe('jsonDeserializer', () => {
  it('does nothing if body is not a string', () => {
    const request = {}
    const response = {
      body: { foo: 'bar' }
    }

    const result = jsonDeserializer(request, response)

    expect(request).toEqual({})
    expect(response).toEqual({
      body: { foo: 'bar' }
    })
    expect(result).toBe(response)
  })

  it('Does nothing if content type is not set', () => {
    const request = {}
    const response = {
      headers: {},
      body: '{"foo":"bar"}'
    }

    const result = jsonDeserializer(request, response)

    expect(request).toEqual({})
    expect(response).toEqual({
      headers: {},
      body: '{"foo":"bar"}'
    })
    expect(result).toBe(response)
  })

  it('Does nothing if content type is not JSON', () => {
    const request = {}
    const response = {
      headers: { 'Content-Type': 'application/xml' },
      body: '{"foo":"bar"}'
    }

    const result = jsonDeserializer(request, response)

    expect(request).toEqual({})
    expect(response).toEqual({
      headers: { 'Content-Type': 'application/xml' },
      body: '{"foo":"bar"}'
    })
    expect(result).toBe(response)
  })

  it('Deserializes JSON', () => {
    const request = {}
    const response = {
      headers: { 'Content-Type': 'application/json' },
      body: '{"foo":"bar"}'
    }

    const result = jsonDeserializer(request, response)

    expect(request).toEqual({})
    expect(response).toEqual({
      headers: { 'Content-Type': 'application/json' },
      body: '{"foo":"bar"}'
    })
    expect(result).toEqual({
      headers: { 'Content-Type': 'application/json' },
      body: { foo: 'bar' }
    })
  })
})
