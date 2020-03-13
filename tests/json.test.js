import { client } from './clients'

it('Gets JSON', async () => {
  const result = await client.get('/api/hello')
  expect(result).toEqual({
    status: 200,
    message: 'OK',
    headers: {
      connection: 'close',
      'content-length': '25',
      'content-type': 'application/json; charset=utf-8',
      date: expect.any(String)
    },
    body: { message: 'hello world' }
  })
})
