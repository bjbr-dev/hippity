import { HttpClient } from './http-client'

describe('constructor', () => {
  test.each([null, 'string', {}])(
    'Throws when middleware is not an array (%j)',
    (value) => {
      // Act
      const act = () => new HttpClient(value)

      // Assert
      expect(act).toThrow(new TypeError('Middleware stack must be an array'))
    }
  )
})

describe('send', () => {
  it('Throws exception when send is called with no middleware registered', async () => {
    // Arrange
    const sut = new HttpClient()

    // Act
    const act = sut.send({})

    // Assert
    await expect(act).rejects.toThrow(
      new Error(
        'Reached end of pipeline. Use a middleware which terminates the pipeline.'
      )
    )
  })

  it('Throws if no middleware terminates', async () => {
    // Arrange
    const sut = new HttpClient().use((r, n) => n(r))

    // Act
    const act = sut.send({})

    // Assert
    await expect(act).rejects.toThrow(
      new Error(
        'Reached end of pipeline. Use a middleware which terminates the pipeline.'
      )
    )
  })

  it('Calls middleware in reverse order', async () => {
    // Arrange
    let order = ''
    const sut = new HttpClient()
      .use(() => {
        order += '1'
        return {}
      })
      .use((r, n) => {
        order += '2'
        return n(r)
      })
      .use((r, n) => {
        order += '3'
        return n(r)
      })

    // Act
    await sut.send({})

    // Assert
    expect(order).toEqual('321')
  })

  it('Calls terminator last', async () => {
    // Arrange
    let order = ''
    const sut = new HttpClient()
      .useTerminator(() => {
        order += '0'
        return {}
      })
      .use((r, n) => {
        order += '1'
        return n(r)
      })

    // Act
    await sut.send({})

    // Assert
    expect(order).toEqual('10')
  })

  it('Lets middleware switch request', async () => {
    // Arrange
    const middleware = jest.fn(() => ({}))
    const sut = new HttpClient()
      .use(middleware)
      .use((_, n) => n({ changed: true }))

    // Act
    await sut.send({})

    // Assert
    expect(middleware).toHaveBeenCalledWith(
      { changed: true },
      expect.any(Function)
    )
  })

  it('Does not call middleware if one terminates earlier in the pipeline', async () => {
    // Arrange
    const middleware = jest.fn()
    const sut = new HttpClient().use(middleware).use(() => ({}))

    // Act
    await sut.send({})

    // Assert
    expect(middleware).not.toHaveBeenCalled()
  })

  it('Uses current request if middleware calls next without a request', async () => {
    // Arrange
    const middleware = jest.fn(() => ({}))

    const sut = new HttpClient().use((_, n) => n()).use(middleware)

    // Act
    await sut.send({ changed: false })

    // Assert
    expect(middleware).toHaveBeenCalledWith(
      { changed: false },
      expect.any(Function)
    )
  })
})

describe('$send', () => {
  it('Returns body of result', async () => {
    // Arrange
    const sut = new HttpClient().use(() => {
      return Promise.resolve({ body: 'body' })
    })

    // Act
    const response = await sut.$send({ GET: 'foo' })

    // Assert
    expect(response).toBe('body')
  })

  test('Requires validation', async () => {
    // Arrange
    const sut = new HttpClient().use(() =>
      Promise.resolve({
        success: false,
        status: 200,
        message: 'OK',
        body: true,
      })
    )

    // Act
    const act = sut.$send({ method: 'DELETE' })

    // Assert
    await expect(act).rejects.toThrow(
      new Error(
        'Response does not indicate success\n\n' +
          'Request: {\n  "method": "DELETE"\n}\n\n' +
          'Response: {\n  "status": 200,\n  "message": "OK",\n  "body": true\n}'
      )
    )
  })
})

describe('use', () => {
  it('Adds middleware to be called in reverse order', async () => {
    // Arrange
    let order = ''
    const sut = new HttpClient()
      .use(function a() {
        order += '1'
        return {}
      })
      .use(function b(r, n) {
        order += '2'
        return n(r)
      })
      .use(function c(r, n) {
        order += '3'
        return n(r)
      })

    // Act
    await sut.send({})

    // Assert
    expect(order).toEqual('321')
  })
})

describe('useFirst', () => {
  it('Adds middleware to run before all others', async () => {
    // Arrange
    let order = ''
    const sut = new HttpClient()
      .use(() => {
        order += '1'
        return {}
      })
      .use((r, n) => {
        order += '2'
        return n(r)
      })
      .useFirst((r, n) => {
        order += '3'
        return n(r)
      })

    // Act
    await sut.send({})

    // Assert
    expect(order).toEqual('321')
  })
})

describe('useLast', () => {
  it('Adds middleware to run after all others but before terminating middleware', async () => {
    // Arrange
    let order = ''
    const sut = new HttpClient()
      .use(() => {
        order += '1'
        return {}
      })
      .use((r, n) => {
        order += '2'
        return n(r)
      })
      .useLast((r, n) => {
        order += '3'
        return n(r)
      })

    // Act
    await sut.send({})

    // Assert
    expect(order).toEqual('231')
  })

  it('Adds only middleware', async () => {
    // Arrange
    let order = ''
    const sut = new HttpClient().useLast(() => {
      order += '1'
      return {}
    })

    // Act
    await sut.send({})

    // Assert
    expect(order).toEqual('1')
  })
})

describe('useTerminator', () => {
  it('Adds terminator if no middleware registered', async () => {
    // Arrange
    let order = ''
    const sut = new HttpClient().useTerminator(() => {
      order += '1'
      return {}
    })

    // Act
    await sut.send({})

    // Assert
    expect(order).toEqual('1')
  })

  it('Replaces terminator', async () => {
    // Arrange
    let order = ''
    const sut = new HttpClient()
      .useTerminator(() => {
        order += '1'
        return {}
      })
      .use((r, n) => {
        order += '2'
        return n(r)
      })
      .useTerminator(() => {
        order += '3'
        return {}
      })

    // Act
    await sut.send({})

    // Assert
    expect(order).toEqual('23')
  })
})

describe('if', () => {
  it('Registers middleware when true', async () => {
    // Arrange
    let order = ''
    const sut = new HttpClient()
      .use(() => {
        order += '1'
        return {}
      })
      .if(true, (c) =>
        c.use((r, n) => {
          order += '2'
          return n(r)
        })
      )

    // Act
    await sut.send({})

    // Assert
    expect(order).toEqual('21')
  })

  it('Does not register middleware when false', async () => {
    // Arrange
    let order = ''
    const sut = new HttpClient()
      .use(() => {
        order += '1'
        return {}
      })
      .if(false, (c) =>
        c.use((r, n) => {
          order += '2'
          return n(r)
        })
      )

    // Act
    await sut.send({})

    // Assert
    expect(order).toEqual('1')
  })
})
