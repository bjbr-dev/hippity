import { userAgentHeaders as sut } from './user-agent'

it('Adds in default user agent', () => {
  const result = sut()

  expect(result).toEqual({ 'user-agent': 'hippity/unknown' })
})

it('Uses configured userAgent', () => {
  const result = sut('overriden')

  expect(result).toEqual({ 'user-agent': 'overriden' })
})
