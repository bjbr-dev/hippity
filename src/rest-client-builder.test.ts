import { RestClientBuilder as Sut, Route } from './index'

let axiosMiddleware: jest.Mock<{}>

jest.mock('./axios-middleware', () => ({
  defaultAxiosMiddleware: jest.fn(() => axiosMiddleware)
}))

describe('CreateDefaultClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    axiosMiddleware = jest.fn()
  })

  it('Creates a client which uses axiosMiddleware', async () => {
    // Arrange
    let request = { request: true }
    let client = new Sut().build()
    axiosMiddleware.mockImplementation(() => ({ status: 200 }))

    // Act
    let result = await client.send(request)

    // Assert
    expect(result).toEqual({ status: 200 })
    expect(axiosMiddleware).toBeCalledWith(
      { request: true },
      expect.any(Function)
    )
  })

  it('Creates a client which normalizes method', async () => {
    // Arrange
    let request = { GET: 'uri' }
    let client = new Sut().build()
    axiosMiddleware.mockImplementation(() => ({ status: 200 }))

    // Act
    let result = await client.send(request)

    // Assert
    expect(result).toEqual({ status: 200 })
    expect(axiosMiddleware).toBeCalledWith(
      { method: 'GET', uri: 'uri' },
      expect.any(Function)
    )
  })

  it('Creates a client which resolves uris', async () => {
    // Arrange
    let request = { uri: ['uri', { foo: 'bar' }] as Route }
    let client = new Sut().build()
    axiosMiddleware.mockImplementation(() => ({ status: 200 }))

    // Act
    let result = await client.send(request)

    // Assert
    expect(result).toEqual({ status: 200 })
    expect(axiosMiddleware).toBeCalledWith(
      { uri: 'uri?foo=bar' },
      expect.any(Function)
    )
  })

  it('Normalizes methods before resolving url', async () => {
    // Arrange
    let request = { GET: ['uri', { foo: 'bar' }] as Route }
    let client = new Sut().build()
    axiosMiddleware.mockImplementation(() => ({ status: 200 }))

    // Act
    let result = await client.send(request)

    // Assert
    expect(result).toEqual({ status: 200 })
    expect(axiosMiddleware).toBeCalledWith(
      { method: 'GET', uri: 'uri?foo=bar' },
      expect.any(Function)
    )
  })
})
