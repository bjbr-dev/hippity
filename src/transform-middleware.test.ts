import { transformMiddleware as sut } from './transform-middleware'

test.each([{}, false, null, 'string'])(
  'Throws when request transform is not an array',
  (value) => {
    // Act
    const act = () => sut(value as [], [])

    // Assert
    expect(act).toThrow(new TypeError('Request transforms must be an array'))
  }
)

test.each([{}, false, null, 'string'])(
  'Throws when response transform is not an array',
  (value) => {
    // Act
    const act = () => sut([], value as [])

    // Assert
    expect(act).toThrow(new TypeError('Response transforms must be an array'))
  }
)

it('Does nothing if no transforms are specified', async () => {
  // Arrange
  const request = {}
  const response = { status: 200, success: true }
  const next = jest.fn(() => Promise.resolve(response))
  const requestTransforms = []
  const responseTransforms = []

  // Act
  const result = await sut(requestTransforms, responseTransforms)(request, next)

  // Assert
  expect(result).toEqual({ status: 200, success: true })
  expect(request).toEqual({})
  expect(response).toEqual({ status: 200, success: true })
  expect(next).toHaveBeenCalledWith(request)
})

it('Transforms the request in order', async () => {
  // Arrange
  const request = { order: '' }
  const response = { status: 200, success: true }
  const next = jest.fn(() => Promise.resolve(response))
  const requestTransforms = [
    (r) => ({ ...r, order: r.order + 'a' }),
    (r) => ({ ...r, order: r.order + 'b' }),
  ]
  const responseTransforms = []

  // Act
  const result = await sut(requestTransforms, responseTransforms)(request, next)

  // Assert
  expect(result).toEqual({ status: 200, success: true })
  expect(request).toEqual({ order: '' })
  expect(response).toEqual({ status: 200, success: true })
  expect(next).toHaveBeenCalledWith({ order: 'ab' })
})

it('Reuses original request if transform does not return anything', async () => {
  // Arrange
  const request = { order: '' }
  const response = { status: 200, success: true }
  const next = jest.fn(() => Promise.resolve(response))
  const requestTransforms = [
    (r) => {
      r.order += 'a'
    },
  ]
  const responseTransforms = []

  // Act
  const result = await sut(requestTransforms, responseTransforms)(request, next)

  // Assert
  expect(result).toEqual({ status: 200, success: true })
  expect(request).toEqual({ order: 'a' })
  expect(response).toEqual({ status: 200, success: true })
  expect(next).toHaveBeenCalledWith({ order: 'a' })
})

it('Transforms the response in order', async () => {
  // Arrange
  const request = {}
  const response = { status: 200, success: true, order: '' }
  const next = jest.fn(() => Promise.resolve(response))
  const requestTransforms = []
  const responseTransforms = [
    (_, res) => ({ ...res, order: res.order + 'a' }),
    (_, res) => ({ ...res, order: res.order + 'b' }),
  ]

  // Act
  const result = await sut(requestTransforms, responseTransforms)(request, next)

  // Assert
  expect(result).toEqual({ status: 200, success: true, order: 'ab' })
  expect(request).toEqual({})
  expect(response).toEqual({ status: 200, success: true, order: '' })
  expect(next).toHaveBeenCalledWith({})
})

it('Reuses original response if transform does not return anything', async () => {
  // Arrange
  const request = {}
  const response = { status: 200, success: true, order: '' }
  const next = jest.fn(() => Promise.resolve(response))
  const requestTransforms = []
  const responseTransforms = [
    (_, res) => {
      res.order += 'a'
    },
  ]

  // Act
  const result = await sut(requestTransforms, responseTransforms)(request, next)

  // Assert
  expect(result).toEqual({ status: 200, success: true, order: 'a' })
  expect(request).toEqual({})
  expect(response).toEqual({ status: 200, success: true, order: 'a' })
  expect(next).toHaveBeenCalledWith({})
})
