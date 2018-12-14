import { defaultHeaderInjector as sut } from './default-header-injector'

test.each([[[]], [null], [undefined], ['header']])(
  'Throws when default headers is not an object (%j)',
  value => {
    // Act
    let act = () => sut(value)

    // Assert
    expect(act).toThrow(new TypeError('Default headers should be an object'))
  }
)

it('Sets headers to empty when there are no headers or default headers', () => {
  // Arrange
  let defaultHeaders = {}
  let request = {}

  // Act
  let result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({})
  expect(result).toEqual({ headers: {} })
})

it('uses common headers', () => {
  // Arrange
  let defaultHeaders = { common: { foo: 'bar' } }
  let request = {}

  // Act
  let result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({})
  expect(result).toEqual({ headers: { foo: 'bar' } })
})

it('uses headers for current method', () => {
  // Arrange
  let defaultHeaders = { PUT: { foo: 'bar' } }
  let request = { method: 'PUT' }

  // Act
  let result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({ method: 'PUT' })
  expect(result).toEqual({ headers: { foo: 'bar' }, method: 'PUT' })
})

it('Does not use headers for a different method', () => {
  // Arrange
  let defaultHeaders = { PUT: { foo: 'bar' } }
  let request = { method: 'POST' }

  // Act
  let result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({ method: 'POST' })
  expect(result).toEqual({ headers: {}, method: 'POST' })
})

it('Overrides common headers with current method', () => {
  // Arrange
  let defaultHeaders = {
    common: { foo: 'baz' },
    PUT: { foo: 'bar' }
  }
  let request = { method: 'PUT' }

  // Act
  let result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({ method: 'PUT' })
  expect(result).toEqual({ headers: { foo: 'bar' }, method: 'PUT' })
})

it('Overrides current method headers with explicit headers', () => {
  // Arrange
  let defaultHeaders = { PUT: { foo: 'bar' } }
  let request = { method: 'PUT', headers: { foo: 'baz' } }

  // Act
  let result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({ method: 'PUT', headers: { foo: 'baz' } })
  expect(result).toEqual({ headers: { foo: 'baz' }, method: 'PUT' })
})

it('Does not change other headers', () => {
  // Arrange
  let defaultHeaders = { common: { foo: 'bar' } }
  let request = { headers: { baz: 'qux' } }

  // Act
  let result = sut(defaultHeaders)(request)

  // Assert
  expect(request).toEqual({ headers: { baz: 'qux' } })
  expect(result).toEqual({ headers: { foo: 'bar', baz: 'qux' } })
})
