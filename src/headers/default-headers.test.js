import { defaultHeaders as sut } from './default-headers'

test.each([null, undefined, 'header', []])(
  'Throws when default headers is not an object (%j)',
  value => {
    // Act
    const act = () => sut(value)

    // Assert
    expect(act).toThrow(new TypeError('Default headers should be an object'))
  }
)

it('Sets headers to empty when there are no headers or default headers', () => {
  // Arrange
  const defaultHeaders = {}
  const request = {}

  // Act
  const result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({})
  expect(result).toEqual({ headers: {} })
})

it('uses common headers', () => {
  // Arrange
  const defaultHeaders = { common: { foo: 'bar' } }
  const request = {}

  // Act
  const result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({})
  expect(result).toEqual({ headers: { foo: 'bar' } })
})

it('uses headers for current method', () => {
  // Arrange
  const defaultHeaders = { PUT: { foo: 'bar' } }
  const request = { method: 'PUT' }

  // Act
  const result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({ method: 'PUT' })
  expect(result).toEqual({ headers: { foo: 'bar' }, method: 'PUT' })
})

it('Does not use headers for a different method', () => {
  // Arrange
  const defaultHeaders = { PUT: { foo: 'bar' } }
  const request = { method: 'POST' }

  // Act
  const result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({ method: 'POST' })
  expect(result).toEqual({ headers: {}, method: 'POST' })
})

it('Overrides common headers with current method', () => {
  // Arrange
  const defaultHeaders = {
    common: { foo: 'baz' },
    PUT: { foo: 'bar' }
  }
  const request = { method: 'PUT' }

  // Act
  const result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({ method: 'PUT' })
  expect(result).toEqual({ headers: { foo: 'bar' }, method: 'PUT' })
})

it('Overrides current method headers with explicit headers', () => {
  // Arrange
  const defaultHeaders = { PUT: { foo: 'bar' } }
  const request = { method: 'PUT', headers: { foo: 'baz' } }

  // Act
  const result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({ method: 'PUT', headers: { foo: 'baz' } })
  expect(result).toEqual({ headers: { foo: 'baz' }, method: 'PUT' })
})

it('Does not change other headers', () => {
  // Arrange
  const defaultHeaders = { common: { foo: 'bar' } }
  const request = { headers: { baz: 'qux' } }

  // Act
  const result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({ headers: { baz: 'qux' } })
  expect(result).toEqual({ headers: { foo: 'bar', baz: 'qux' } })
})
