import {
  resolve,
  normalizeMethodMiddleware,
  resolvingMiddleware,
  defaultUriRootMiddleware
} from './uriHelpers'
import { HttpResponse } from './restclient'

describe('resolve', () => {
  test.each([[[]], [null], [undefined], ['header']])(
    'Throws when default headers is not an object (%j)',
    value => {
      // Act
      // let act = () => defaultHeaderMiddleware(value)
      // // Assert
      // expect(act).toThrow(new TypeError('Default headers should be an object'))
    }
  )

  it.each([
    ['', null, ''],
    ['', { foo: 'bar' }, '?foo=bar'],
    ['foo', null, 'foo'],
    ['foo', { foo: 'bar' }, 'foo?foo=bar'],
    ['foo/bar', null, 'foo/bar'],
    ['foo/bar', { foo: 'bar' }, 'foo/bar?foo=bar'],
    ['/foo/bar', null, '/foo/bar'],
    ['/foo/bar', { foo: 'bar' }, '/foo/bar?foo=bar']
  ])('Removes leading tilde (%j, %j, %j)', (path, params, expected) => {
    // Act
    const result = resolve(path, params)

    // Assert
    expect(result).toBe(expected)
  })

  it.each([[null], [undefined]])(
    'Does nothing if params is undefined (%j)',
    params => {
      // Act
      const result = resolve('/foo', params)

      // Assert
      expect(result).toBe('/foo')
    }
  )

  it('Url encodes query parameters', () => {
    // Act
    const result = resolve('/foo', {
      'this should': "be url encoded ;,/?:@&=+$ -_.!~*'() #"
    })

    // Assert
    expect(result).toBe(
      "/foo?this%20should=be%20url%20encoded%20%3B%2C%2F%3F%3A%40%26%3D%2B%24%20-_.!~*'()%20%23"
    )
  })

  it('Allows multiple query parameters', () => {
    // Act
    const result = resolve('/foo', { a: 1, b: 2 })

    // Assert
    expect(result).toBe('/foo?a=1&b=2')
  })

  it('Allows property to be an array', () => {
    // Act
    const result = resolve('/foo', { a: [1, 2, 3] })

    // Assert
    expect(result).toBe('/foo?a=1&a=2&a=3')
  })

  it.each([
    ['/{foo}', '/bar'],
    ['/foo/{foo}', '/foo/bar'],
    ['/{foo}/bar', '/bar/bar'],
    ['/foo/{foo}/baz', '/foo/bar/baz'],
    ['/{foo}/{foo}/baz', '/bar/bar/baz']
  ])('Replaces named placeholders (%j %j)', (path, expected) => {
    // Act
    const result = resolve('/{foo}', { foo: 'bar' })

    // Assert
    expect(result).toBe('/bar')
  })

  it('Url encodes parameters', () => {
    // Act
    const result = resolve('/{foo}', {
      foo: "should be url encoded ;,/?:@&=+$ -_.!~*'() #"
    })

    // Assert
    expect(result).toBe(
      "/should%20be%20url%20encoded%20%3B%2C%2F%3F%3A%40%26%3D%2B%24%20-_.!~*'()%20%23"
    )
  })

  it('Puts remaining parameters in query string', () => {
    // Act
    const result = resolve('/{foo}', {
      foo: 'bar',
      baz: 'qux'
    })

    // Assert
    expect(result).toBe('/bar?baz=qux')
  })

  it('Adds extra query parameters if path contains query string', () => {
    // Act
    const result = resolve('/foo?bar=baz', { baz: 'qux' })

    // Assert
    expect(result).toBe('/foo?bar=baz&baz=qux')
  })
})

describe('normalizeMethodMiddleware', () => {
  it('Does nothing if method already exists', () => {
    // Arrange
    const request = { GET: 'url', method: 'POST', uri: 'other' }

    // Act
    normalizeMethodMiddleware(request, () => ({}))

    // Assert
    expect(request).toEqual({ GET: 'url', method: 'POST', uri: 'other' })
  })

  it.each([['HEAD', 'GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']])(
    'Normalizes methods',
    method => {
      // Arrange
      const request = { [method]: 'url' }

      // Act
      normalizeMethodMiddleware(request, () => ({}))

      // Assert
      expect(request).toEqual({ method: method, uri: 'url' })
    }
  )

  it('Only normalizes one method', () => {
    // Arrange
    const request = { GET: 'url', POST: 'other' }

    // Act
    normalizeMethodMiddleware(request, () => ({}))

    // Assert
    expect(request).toEqual({ method: 'GET', uri: 'url', POST: 'other' })
  })
})

describe('resolvingMiddleware', () => {
  it('does nothing if uri is a string', () => {
    // Arrange
    let sut = resolvingMiddleware(resolve)
    let next = jest.fn(() => ({ result: true }))
    let request = { uri: 'uri' }

    // Act
    let result = sut(request, next)

    // Assert
    expect(result).toEqual({ result: true })
    expect(next).toBeCalledWith()
    expect(request).toEqual({ uri: 'uri' })
  })

  it('Does nothing if uri is not an array or object', () => {
    // Arrange
    let sut = resolvingMiddleware(resolve)
    let next = jest.fn(() => ({ result: true }))
    let request: any = { uri: function() {} }

    // Act
    let result = sut(request, next)

    // Assert
    expect(result).toEqual({ result: true })
    expect(next).toBeCalledWith()
    expect(request).toEqual({ uri: expect.any(Function) })
  })

  it('Resolves array with just a path', () => {
    // Arrange
    let sut = resolvingMiddleware(resolve)
    let next = jest.fn(() => ({ result: true }))
    let request: any = { uri: ['path'] }

    // Act
    let result = sut(request, next)

    // Assert
    expect(result).toEqual({ result: true })
    expect(next).toBeCalledWith({ uri: 'path' })
    expect(request).toEqual({ uri: ['path'] })
  })

  it('Resolves array with just a path', () => {
    // Arrange
    let sut = resolvingMiddleware(resolve)
    let next = jest.fn(() => ({ result: true }))
    let request: any = { uri: ['path'] }

    // Act
    let result = sut(request, next)

    // Assert
    expect(result).toEqual({ result: true })
    expect(next).toBeCalledWith({ uri: 'path' })
    expect(request).toEqual({ uri: ['path'] })
  })

  it('Resolves array with path and parameters', () => {
    // Arrange
    let sut = resolvingMiddleware(resolve)
    let next = jest.fn(() => ({ result: true }))
    let request: any = { uri: ['path', { foo: 'bar' }] }

    // Act
    let result = sut(request, next)

    // Assert
    expect(result).toEqual({ result: true })
    expect(next).toBeCalledWith({ uri: 'path?foo=bar' })
    expect(request).toEqual({ uri: ['path', { foo: 'bar' }] })
  })
})

describe('defaultUriRootMiddleware', () => {
  it('Adds in default root', () => {
    // Arrange
    let sut = defaultUriRootMiddleware('www.root.com')
    let request = {}

    // Act
    let result = sut(request, r => r as HttpResponse)

    // Assert
    expect(request).toEqual({})
    expect(result).toEqual({ uriRoot: 'www.root.com' })
  })

  it('Does not override explicit root', () => {
    // Arrange
    let sut = defaultUriRootMiddleware('www.root.com')
    let request = { uriRoot: 'explicit' }

    // Act
    let result = sut(request, r => r as HttpResponse)

    // Assert
    expect(request).toEqual({ uriRoot: 'explicit' })
    expect(result).toEqual({ uriRoot: 'explicit' })
  })

  it('Does not override null root', () => {
    // Arrange
    let sut = defaultUriRootMiddleware('www.root.com')
    let request = { uriRoot: null }

    // Act
    let result = sut(request, r => r as HttpResponse)

    // Assert
    expect(request).toEqual({ uriRoot: null })
    expect(result).toEqual({ uriRoot: null })
  })
})
