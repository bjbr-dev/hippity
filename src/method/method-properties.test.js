import { urlInMethodProperties as sut } from './method-properties'

it('Does nothing if method already exists', () => {
  // Arrange
  const request = { GET: 'url', method: 'POST', url: 'other' }

  // Act
  const result = sut(request)

  // Assert
  expect(request).toEqual({ GET: 'url', method: 'POST', url: 'other' })
  expect(result).toBe(request)
})

it.each([['HEAD', 'GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']])(
  'Normalizes methods',
  method => {
    // Arrange
    const request = { [method]: 'url' }

    // Act
    const result = sut(request)

    // Assert
    expect(request).toEqual({ [method]: 'url' })
    expect(result).toEqual({ method: method, url: 'url' })
  }
)

it('Only normalizes first matching method', () => {
  // Arrange
  const request = { GET: 'url', POST: 'other' }

  // Act
  const result = sut(request)

  // Assert
  expect(request).toEqual({ GET: 'url', POST: 'other' })
  expect(result).toEqual({ method: 'GET', url: 'url', POST: 'other' })
})
