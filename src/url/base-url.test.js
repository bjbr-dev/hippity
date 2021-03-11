import { baseUrl as sut } from './base-url'

it('Adds in default base', () => {
  // Arrange
  const base = 'https://www.base.com'
  const request = { url: 'foo' }

  // Act
  const result = sut(base)(request)

  // Assert
  expect(request).toEqual({ url: 'foo' })
  expect(result).toEqual({ url: 'https://www.base.com/foo' })
})

it.each([undefined, null, ''])('Does nothing if base is not set', (base) => {
  // Arrange
  const request = { url: 'foo' }

  // Act
  const result = sut(base)(request)

  // Assert
  expect(request).toEqual({ url: 'foo' })
  expect(result).toEqual({ url: 'foo' })
})

it.each`
  url
  ${'https://explicit.com'}
  ${'https://www.explicit.com'}
  ${'http://.explicit.com'}
  ${'ftp://explicit.com'}
`('Does not override absolute urls', ({ url }) => {
  // Arrange
  const base = 'https://www.base.com'
  const request = { url: url }

  // Act
  const result = sut(base)(request)

  // Assert
  expect(request).toEqual({ url: url })
  expect(result).toEqual({ url: url })
})

it('Combines base with null', () => {
  // Arrange
  const base = 'https://www.base.com'
  const request = { url: null }

  // Act
  const result = sut(base)(request)

  // Assert
  expect(request).toEqual({ url: null })
  expect(result).toEqual({ url: 'https://www.base.com' })
})

it('Allows base url to be overriden on a request', () => {
  // Arrange
  const base = 'https://www.base.com'
  const request = { baseUrl: 'https://override.com/', url: 'foo' }

  // Act
  const result = sut(base)(request)

  // Assert
  expect(request).toEqual({ baseUrl: 'https://override.com/', url: 'foo' })
  expect(result).toEqual({ url: 'https://override.com/foo' })
})

it('Removes base url if empty', () => {
  // Arrange
  const request = { baseUrl: undefined, url: 'foo' }

  // Act
  const result = sut()(request)

  // Assert
  expect(request).toEqual({ baseUrl: undefined, url: 'foo' })
  expect(result).toEqual({ url: 'foo' })
})
