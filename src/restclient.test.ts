import { RestClient } from './restClient'

describe('RestClient', () => {
  describe('constructor', () => {
    test.each([[null], ['string'], [{}]])(
      'Throws when middleware is not an array (%j)',
      value => {
        // Act
        let act = () => new RestClient(value)

        // Assert
        expect(act).toThrow(new TypeError('Middleware stack must be an array'))
      }
    )
  })

  describe('send', () => {
    it('Throws exception when send is called with no middleware registered', () => {
      // Arrange
      let sut = new RestClient()

      // Act
      let act = () => sut.send({})

      // Assert
      expect(act).toThrow(
        new Error(
          'Reached end of pipeline. Use a middleware which terminates the pipeline.'
        )
      )
    })

    it('Throws if no middleware terminates', () => {
      // Arrange
      let sut = new RestClient().use((c, n) => n(c))

      // Act
      let act = () => sut.send({})

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
      let sut = new RestClient()
        .use((c, n) => {
          order += '1'
          return n(c)
        })
        .use((c, n) => {
          order += '2'
          return n(c)
        })
        .use((c, n) => {
          order += '3'
          return {}
        })

      // Act
      sut.send({})

      // Assert
      expect(order).toEqual('123')
    })

    it('Lets middleware switch context', () => {
      // Arrange
      let middleware = jest.fn((c, n) => ({}))
      let sut = new RestClient()
        .use((c, n) => {
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
      let middleware = jest.fn()
      let sut = new RestClient()
        .use((c, n) => {
          return {}
        })
        .use(middleware)

      // Act
      sut.send({})

      // Assert
      expect(middleware).not.toBeCalled()
    })

    it('Uses current context if middleware calls next without a context', () => {
      // Arrange
      let middleware = jest.fn((c, n) => ({}))

      let sut = new RestClient().use((_, n) => n()).use(middleware)

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
      let sut = new RestClient().use(() => ({ status: 200, body: 'body' }))

      // Act
      let response = await sut.$send({})

      // Assert
      expect(response).toBe('body')
    })

    test.each([[199, 300, 301]])(
      'Throws error if status indicates failure (%j)',
      async status => {
        // Arrange
        let sut = new RestClient().use(() =>
          Promise.resolve({ status: status, body: 'body' })
        )

        // Act
        let act = sut.$send({})

        // Assert
        await expect(act).rejects.toThrow(
          new Error('Unexpected status code: ' + status)
        )
      }
    )
  })
})
