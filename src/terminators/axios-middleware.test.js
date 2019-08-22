import { axiosMiddleware } from './axios-middleware'

describe('axiosMiddleware', () => {
  it('Exports axiosMiddleware', () => {
    expect(axiosMiddleware).not.toBeFalsy()
  })
})
