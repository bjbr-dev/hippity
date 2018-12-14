import { uriRootApplier as sut } from './uri-root-applier'

describe('defaultUriRootMiddleware', () => {
  it('Adds in default root', () => {
    // Arrange
    let root = 'www.root.com'
    let request = {}

    // Act
    let result = sut(root)(request)

    // Assert
    expect(request).toEqual({})
    expect(result).toEqual({ uriRoot: 'www.root.com' })
  })

  it('Does not override explicit root', () => {
    // Arrange
    let root = 'www.root.com'
    let request = { uriRoot: 'explicit' }

    // Act
    let result = sut(root)(request)

    // Assert
    expect(request).toEqual({ uriRoot: 'explicit' })
    expect(result).toEqual({ uriRoot: 'explicit' })
  })

  it('Does not override null root', () => {
    // Arrange
    let root = 'www.root.com'
    let request = { uriRoot: null }

    // Act
    let result = sut(root)(request)

    // Assert
    expect(request).toEqual({ uriRoot: null })
    expect(result).toEqual({ uriRoot: null })
  })
})
