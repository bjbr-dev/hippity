import {
  transformMiddleware as sut,
  RequestTransform,
  ResponseTransform
} from './transform-middleware'

test.each([[{}], [false], [null], [undefined], ['string']])(
  'Throws when request transform is not an array',
  value => {
    // Act
    let act = () => sut(value, [])

    // Assert
    expect(act).toThrow(new TypeError('Request transforms must be an array'))
  }
)

test.each([[{}], [false], [null], [undefined], ['string']])(
  'Throws when resposne transform is not an array',
  value => {
    // Act
    let act = () => sut([], value)

    // Assert
    expect(act).toThrow(new TypeError('Response transforms must be an array'))
  }
)

it('Does nothing if no transforms are specified', async () => {
  // Arrange
  let request = {}
  let response = {}
  let next = jest.fn(() => response)
  let requestTransforms: RequestTransform[] = []
  let responseTransforms: ResponseTransform[] = []

  // Act
  let result = await sut(requestTransforms, responseTransforms)(request, next)

  // Assert
  expect(result).toEqual({})
  expect(request).toEqual({})
  expect(response).toEqual({})
  expect(next).toBeCalledWith(request)
})

it('Transforms the request in order', async () => {
  // Arrange
  let request = { order: '' }
  let response = {}
  let next = jest.fn(() => response)
  let requestTransforms: RequestTransform[] = [
    r => ({ ...r, order: r.order + 'a' }),
    r => ({ ...r, order: r.order + 'b' })
  ]
  let responseTransforms: ResponseTransform[] = []

  // Act
  let result = await sut(requestTransforms, responseTransforms)(request, next)

  // Assert
  expect(result).toEqual({})
  expect(request).toEqual({ order: '' })
  expect(response).toEqual({})
  expect(next).toBeCalledWith({ order: 'ab' })
})

it('Transforms the response in order', async () => {
  // Arrange
  let request = {}
  let response = { order: '' }
  let next = jest.fn(() => response)
  let requestTransforms: RequestTransform[] = []
  let responseTransforms: ResponseTransform[] = [
    (req, res) => ({ ...res, order: res.order + 'a' }),
    (req, res) => ({ ...res, order: res.order + 'b' })
  ]

  // Act
  let result = await sut(requestTransforms, responseTransforms)(request, next)

  // Assert
  expect(result).toEqual({ order: 'ab' })
  expect(request).toEqual({})
  expect(response).toEqual({ order: '' })
  expect(next).toBeCalledWith({})
})
