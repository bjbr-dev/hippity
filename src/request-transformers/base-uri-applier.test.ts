import { baseUriApplier as sut } from './base-uri-applier'

it('Adds in default base', () => {
  // Arrange
  let base = 'www.base.com'
  let request = {}

  // Act
  let result = sut(base)(request)

  // Assert
  expect(request).toEqual({})
  expect(result).toEqual({ baseUri: 'www.base.com' })
})

it('Does not override explicit base', () => {
  // Arrange
  let base = 'www.base.com'
  let request = { baseUri: 'explicit' }

  // Act
  let result = sut(base)(request)

  // Assert
  expect(request).toEqual({ baseUri: 'explicit' })
  expect(result).toEqual({ baseUri: 'explicit' })
})

it('Does not override null base', () => {
  // Arrange
  let base = 'www.base.com'
  let request = { baseUri: null }

  // Act
  let result = sut(base)(request)

  // Assert
  expect(request).toEqual({ baseUri: null })
  expect(result).toEqual({ baseUri: null })
})
