import { validationMiddleware as sut } from './validationMiddleware'

describe('ValidationMiddleware', () => {
  test('Does nothing when no validate property defined', async () => {
    // Arrange
    let request = {}
    let next = () => ({ status: 500 })

    // Act
    let response = await sut(request, next)

    // Assert
    expect(response).toEqual({ status: 500 })
  })

  test.each([[199, 300, 301, 400, 404, 410, 500]])(
    'Throws error if status indicates failure (%j)',
    async status => {
      // Arrange
      let request = { method: 'GET', validate: true }
      let next = () => ({ status: status })

      // Act
      let act = sut(request, next)

      // Assert
      await expect(act).rejects.toThrow(
        new Error(
          `Unexpected status code: ${status} (No message)\n\n` +
            'Requested: {\n  "method": "GET"\n}\n\n' +
            `Response: {\n  "status": ${status}\n}`
        )
      )
    }
  )

  test.each([[200, 201, 298, 299]])(
    'Allows valid statuses (%j)',
    async status => {
      // Arrange
      let request = { method: 'GET', validate: true }
      let next = () => ({ status: status, body: true })

      // Act
      let response = await sut(request, next)

      // Assert
      expect(response).toBeTruthy()
    }
  )

  test.each([[404, 410]])(
    'Allows delete methods to have 404 and 410 (%j)',
    async status => {
      // Arrange
      let request = { method: 'DELETE', validate: true }
      let next = () => ({ status: status, body: true })

      // Act
      let response = await sut(request, next)

      // Assert
      expect(response).toBeTruthy()
    }
  )

  test('Throws error is status is not a number', async () => {
    // Arrange
    let request = { method: 'DELETE', validate: true }
    let next: any = () => ({ status: '200', message: 'OK', body: true })

    // Act
    let act = sut(request, next)

    // Assert
    await expect(act).rejects.toThrow(
      new Error(
        'Unexpected status code: 200 (OK)\n\n' +
          'Requested: {\n  "method": "DELETE"\n}\n\n' +
          'Response: {\n  "status": "200",\n  "message": "OK",\n  "body": true\n}'
      )
    )
  })
})
