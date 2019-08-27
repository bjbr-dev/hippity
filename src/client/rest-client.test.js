import { RestClient } from './rest-client'

describe('RestClient', () => {
  describe('constructor', () => {
    test.each([null, 'string', {}])(
      'Throws when middleware is not an array (%j)',
      value => {
        // Act
        const act = () => new RestClient(value)

        // Assert
        expect(act).toThrow(new TypeError('Middleware stack must be an array'))
      }
    )
  })

  describe('send', () => {
    it('Throws exception when send is called with no middleware registered', () => {
      // Arrange
      const sut = new RestClient()

      // Act
      const act = () => sut.send({})

      // Assert
      expect(act).toThrow(
        new Error(
          'Reached end of pipeline. Use a middleware which terminates the pipeline.'
        )
      )
    })

    it('Throws if no middleware terminates', () => {
      // Arrange
      const sut = new RestClient().use((r, n) => n(r))

      // Act
      const act = () => sut.send({})

      // Assert
      expect(act).toThrow(
        new Error(
          'Reached end of pipeline. Use a middleware which terminates the pipeline.'
        )
      )
    })

    it('Calls middleware in order', () => {
      // Arrange
      let order = ''
      const sut = new RestClient()
        .use((r, n) => {
          order += '1'
          return n(r)
        })
        .use((r, n) => {
          order += '2'
          return n(r)
        })
        .use(() => {
          order += '3'
          return {}
        })

      // Act
      sut.send({})

      // Assert
      expect(order).toEqual('123')
    })

    it('Lets middleware switch request', () => {
      // Arrange
      const middleware = jest.fn(() => ({ success: true }))
      const sut = new RestClient()
        .use((_, n) => {
          return n({ changed: true })
        })
        .use(middleware)

      // Act
      sut.send({})

      // Assert
      expect(middleware).toBeCalledWith({ changed: true }, expect.any(Function))
    })

    it('Does not call middleware if one terminates earlier in the pipeline', () => {
      // Arrange
      const middleware = jest.fn()
      const sut = new RestClient()
        .use(() => {
          return { success: true }
        })
        .use(middleware)

      // Act
      sut.send({})

      // Assert
      expect(middleware).not.toBeCalled()
    })

    it('Uses current request if middleware calls next without a request', () => {
      // Arrange
      const middleware = jest.fn(() => ({ success: true }))

      const sut = new RestClient().use((_, n) => n()).use(middleware)

      // Act
      sut.send({ changed: false })

      // Assert
      expect(middleware).toBeCalledWith(
        { changed: false },
        expect.any(Function)
      )
    })
  })

  describe('$send', () => {
    it('Returns body of result', async () => {
      // Arrange
      const sut = new RestClient().use(() => {
        return Promise.resolve({ body: 'body' })
      })

      // Act
      const response = await sut.$send({ GET: 'foo' })

      // Assert
      expect(response).toBe('body')
    })

    test('Requires validation', async () => {
      // Arrange
      const sut = new RestClient().use(() =>
        Promise.resolve({
          success: false,
          status: 200,
          message: 'OK',
          body: true
        })
      )

      // Act
      const act = sut.$send({ method: 'DELETE' })

      // Assert
      await expect(act).rejects.toThrow(
        new Error(
          'Response does not indicate success\n\n' +
            'Request: {\n  "method": "DELETE"\n}\n\n' +
            'Response: {\n  "success": false,\n  "status": 200,\n  "message": "OK",\n  "body": true\n}'
        )
      )
    })
  })
})
