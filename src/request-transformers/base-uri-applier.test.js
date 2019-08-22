import { baseUriApplier as sut } from './base-uri-applier'

it('Adds in default base', () => {
  // Arrange
  const base = 'www.base.com'
  const request = {}

  // Act
  const result = sut(base)(request)

  // Assert
  expect(request).toEqual({})
  expect(result).toEqual({ baseUri: 'www.base.com' })
})

it('Does not override explicit base', () => {
  // Arrange
  const base = 'www.base.com'
  const request = { baseUri: 'explicit' }

  // Act
  const result = sut(base)(request)

  // Assert
  expect(request).toEqual({ baseUri: 'explicit' })
  expect(result).toEqual({ baseUri: 'explicit' })
})

it('Does not override null base', () => {
  // Arrange
  const base = 'www.base.com'
  const request = { baseUri: null }

  // Act
  const result = sut(base)(request)

  // Assert
  expect(request).toEqual({ baseUri: null })
  expect(result).toEqual({ baseUri: null })
})
