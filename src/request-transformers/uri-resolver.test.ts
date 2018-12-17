import { uriResolver as sut } from './uri-resolver'
import { dotNetResolve as resolve } from '~/src/dot-net-resolve'

it('does nothing if uri is a string', () => {
  // Arrange
  let request = { uri: 'uri' }

  // Act
  let result = sut(resolve)(request)

  // Assert
  expect(request).toEqual({ uri: 'uri' })
  expect(result).toBe(request)
})

it('Does nothing if uri is not an array or object', () => {
  // Arrange
  let request: any = { uri: function() {} }

  // Act
  let result = sut(resolve)(request)

  // Assert
  expect(request).toEqual({ uri: expect.any(Function) })
  expect(result).toBe(request)
})

it('Resolves array with just a path', () => {
  // Arrange
  let request: any = { uri: ['path'] }

  // Act
  let result = sut(resolve)(request)

  // Assert
  expect(request).toEqual({ uri: ['path'] })
  expect(result).toEqual({ uri: 'path' })
})

it('Resolves array with just a path', () => {
  // Arrange
  let request: any = { uri: ['path'] }

  // Act
  let result = sut(resolve)(request)

  // Assert
  expect(request).toEqual({ uri: ['path'] })
  expect(result).toEqual({ uri: 'path' })
})

it('Resolves array with path and parameters', () => {
  // Arrange
  let request: any = { uri: ['path', { foo: 'bar' }] }

  // Act
  let result = sut(resolve)(request)

  // Assert
  expect(request).toEqual({ uri: ['path', { foo: 'bar' }] })
  expect(result).toEqual({ uri: 'path?foo=bar' })
})

it('Copies other properties on request', () => {
  // Arrange
  let request: any = {
    uri: ['path', { foo: 'bar' }],
    undefined: void 0,
    null: null,
    number: 1,
    boolean: true,
    string: 'foo',
    array: [1, 2],
    object: {}
  }

  // Act
  let result = sut(resolve)(request)

  // Assert
  expect(request).toEqual({
    uri: ['path', { foo: 'bar' }],
    undefined: void 0,
    null: null,
    number: 1,
    boolean: true,
    string: 'foo',
    array: [1, 2],
    object: {}
  })

  expect(result).toEqual({
    uri: 'path?foo=bar',
    undefined: void 0,
    null: null,
    number: 1,
    boolean: true,
    string: 'foo',
    array: [1, 2],
    object: {}
  })
})
