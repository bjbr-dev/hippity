import { client } from './clients'

it('Waits for request', async () => {
  const result = await client.get(['/api/sleep', { ms: 150 }], {
    timeout: 2000
  })

  expect(result).toEqual({
    success: true,
    status: 200,
    message: 'OK',
    headers: {
      connection: 'close',
      'content-length': '16',
      'content-type': 'application/json; charset=utf-8',
      date: expect.any(String)
    },
    body: { message: 'OK' }
  })
})

it('Can timeout', async () => {
  const result = client.get(['/api/sleep', { ms: 500 }], {
    timeout: 50
  })
  await expect(result).rejects.toThrow('Aborted')
})
