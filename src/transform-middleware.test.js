import {
  transformMiddleware as sut,
  RequestTransform,
  ResponseTransform
} from './transform-middleware'

test.each([{}, false, null, undefined, 'string'])(
  'Throws when request transform is not an array',
  value => {
    // Act
    const act = () => sut(value, [])

    // Assert
    expect(act).toThrow(new TypeError('Request transforms must be an array'))
  }
)

test.each([{}, false, null, undefined, 'string'])(
  'Throws when response transform is not an array',
  value => {
    // Act
    const act = () => sut([], value)

    // Assert
    expect(act).toThrow(new TypeError('Response transforms must be an array'))
  }
)

it('Does nothing if no transforms are specified', async () => {
  // Arrange
  const request = {}
  const response = { success: true }
  const next = jest.fn(() => response)
  const requestTransforms = []
  const responseTransforms = []

  // Act
  const result = await sut(requestTransforms, responseTransforms)(request, next)

  // Assert
  expect(result).toEqual({ success: true })
  expect(request).toEqual({})
  expect(response).toEqual({ success: true })
  expect(next).toBeCalledWith(request)
})

it('Transforms the request in order', async () => {
  // Arrange
  const request = { order: '' }
  const response = { success: true }
  const next = jest.fn(() => response)
  const requestTransforms = [
    r => ({ ...r, order: r.order + 'a' }),
    r => ({ ...r, order: r.order + 'b' })
  ]
  const responseTransforms = []

  // Act
  const result = await sut(requestTransforms, responseTransforms)(request, next)

  // Assert
  expect(result).toEqual({ success: true })
  expect(request).toEqual({ order: '' })
  expect(response).toEqual({ success: true })
  expect(next).toBeCalledWith({ order: 'ab' })
})

it('Transforms the response in order', async () => {
  // Arrange
  const request = {}
  const response = { success: true, order: '' }
  const next = jest.fn(() => response)
  const requestTransforms = []
  const responseTransforms = [
    (_, res) => ({ ...res, order: res.order + 'a' }),
    (_, res) => ({ ...res, order: res.order + 'b' })
  ]

  // Act
  const result = await sut(requestTransforms, responseTransforms)(request, next)

  // Assert
  expect(result).toEqual({ success: true, order: 'ab' })
  expect(request).toEqual({})
  expect(response).toEqual({ success: true, order: '' })
  expect(next).toBeCalledWith({})
})
