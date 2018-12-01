import { defaultHeaderMiddleware } from './headerHelpers'

describe('defaultHeaderMiddleware', () => {
  test.each([[[]], [null], [undefined], ['header']])(
    'Throws when default headers is not an object (%j)',
    value => {
      // Act
      let act = () => defaultHeaderMiddleware(value)

      // Assert
      expect(act).toThrow(new TypeError('Default headers should be an object'))
    }
  )

  it('Sets headers to empty when there are no headers or default headers', () => {
    // Arrange
    let sut = defaultHeaderMiddleware({})
    let request = {}
    let next = jest.fn()

    // Act
    sut(request, next)

    // Assert
    expect(request).toEqual({})
    expect(next).toBeCalledWith({ headers: {} })
  })

  it('uses common headers', () => {
    // Arrange
    let sut = defaultHeaderMiddleware({ common: { foo: 'bar' } })
    let request = {}
    let next = jest.fn()

    // Act
    sut(request, next)

    // Assert
    expect(request).toEqual({})
    expect(next).toBeCalledWith({ headers: { foo: 'bar' } })
  })

  it('uses headers for current method', () => {
    // Arrange
    let sut = defaultHeaderMiddleware({ PUT: { foo: 'bar' } })
    let request = { method: 'PUT' }
    let next = jest.fn()

    // Act
    sut(request, next)

    // Assert
    expect(request).toEqual({ method: 'PUT' })
    expect(next).toBeCalledWith({ headers: { foo: 'bar' }, method: 'PUT' })
  })

  it('Does not use headers for a different method', () => {
    // Arrange
    let sut = defaultHeaderMiddleware({ PUT: { foo: 'bar' } })
    let request = { method: 'POST' }
    let next = jest.fn()

    // Act
    sut(request, next)

    // Assert
    expect(request).toEqual({ method: 'POST' })
    expect(next).toBeCalledWith({ headers: {}, method: 'POST' })
  })

  it('Overrides common headers with current method', () => {
    // Arrange
    let sut = defaultHeaderMiddleware({
      common: { foo: 'baz' },
      PUT: { foo: 'bar' }
    })

    let request = { method: 'PUT' }
    let next = jest.fn()

    // Act
    sut(request, next)

    // Assert
    expect(request).toEqual({ method: 'PUT' })
    expect(next).toBeCalledWith({ headers: { foo: 'bar' }, method: 'PUT' })
  })

  it('Overrides current method headers with explicit headers', () => {
    // Arrange
    let sut = defaultHeaderMiddleware({ PUT: { foo: 'bar' } })
    let request = { method: 'PUT', headers: { foo: 'baz' } }
    let next = jest.fn()

    // Act
    sut(request, next)

    // Assert
    expect(request).toEqual({ method: 'PUT', headers: { foo: 'baz' } })
    expect(next).toBeCalledWith({ headers: { foo: 'baz' }, method: 'PUT' })
  })

  it('Does not change other headers', () => {
    // Arrange
    let sut = defaultHeaderMiddleware({ common: { foo: 'bar' } })
    let request = { headers: { baz: 'qux' } }
    let next = jest.fn()

    // Act
    sut(request, next)

    // Assert
    expect(request).toEqual({ headers: { baz: 'qux' } })
    expect(next).toBeCalledWith({ headers: { foo: 'bar', baz: 'qux' } })
  })
})
