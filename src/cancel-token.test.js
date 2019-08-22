import { CancellationTokenSource } from './cancel-token'

test('Token is not cancelled by default', () => {
  // Arrange
  const source = new CancellationTokenSource()
  const token = source.token

  // Assert
  expect(source.cancelled).toBe(false)
  expect(token.cancelled).toBe(false)
  expect(() => token.throwIfCancelled()).not.toThrowError()
})

test('Can cancel', () => {
  // Arrange
  const source = new CancellationTokenSource()
  const token = source.token

  // Act
  source.cancel()

  // Assert
  expect(source.cancelled).toBe(true)
  expect(token.cancelled).toBe(true)
  expect(() => token.throwIfCancelled()).toThrowError('Promise was cancelled')
})

test('Can cancel with custom message', () => {
  // Arrange
  const source = new CancellationTokenSource()
  const token = source.token

  // Act
  source.cancel('foo')

  // Assert
  expect(source.cancelled).toBe(true)
  expect(token.cancelled).toBe(true)
  expect(() => token.throwIfCancelled()).toThrowError(
    'Promise was cancelled: foo'
  )
})

test('Calls all callbacks on cancel', () => {
  // Arrange
  const source = new CancellationTokenSource()
  const token = source.token

  const callbacks = [jest.fn(), jest.fn()]
  for (const callback of callbacks) {
    token.onCancel(callback)
  }

  // Act
  source.cancel()

  // Assert
  expect(callbacks[0]).toBeCalled()
  expect(callbacks[1]).toBeCalled()
})

test('Serializes token to JSON nicely', () => {
  // Arrange
  const source = new CancellationTokenSource()
  const token = source.token

  // Act
  const json = JSON.stringify({ token: token })

  // Assert
  expect(json).toEqual('{"token":{"cancelled":false}}')
})
