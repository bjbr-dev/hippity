import { client } from './clients'

it('Gets JSON', async () => {
  const result = await client.get('/api/hello')

  expect(result).toEqual({
    success: true,
    status: 200,
    message: 'OK',
    headers: {
      connection: 'close',
      'content-length': '25',
      'content-type': 'application/json; charset=utf-8',
      date: expect.any(String),
    },
    body: { message: 'hello world' },
    request: expect.anything(),
  })
})

it('Posts JSON', async () => {
  const result = await client.post('/api/reflect', { message: 'hello world' })

  expect(result).toEqual({
    success: true,
    status: 200,
    message: 'OK',
    headers: {
      connection: 'close',
      'content-length': '274',
      'content-type': 'application/json; charset=utf-8',
      date: expect.any(String),
    },
    body: {
      url: '/api/reflect',
      method: 'POST',
      headers: {
        accept: 'application/json, text/plain, */*',
        connection: 'close',
        'content-length': '25',
        'content-type': 'application/json;charset=utf-8',
        host: 'localhost:3000',
        'user-agent': 'hippity/unknown',
      },
      body: { message: 'hello world' },
    },
    request: expect.anything(),
  })
})

it('PUTs JSON', async () => {
  const result = await client.put('/api/reflect', { message: 'hello world' })

  expect(result).toEqual({
    success: true,
    status: 200,
    message: 'OK',
    headers: {
      connection: 'close',
      'content-length': '273',
      'content-type': 'application/json; charset=utf-8',
      date: expect.any(String),
    },
    body: {
      url: '/api/reflect',
      method: 'PUT',
      headers: {
        accept: 'application/json, text/plain, */*',
        connection: 'close',
        'content-length': '25',
        'content-type': 'application/json;charset=utf-8',
        host: 'localhost:3000',
        'user-agent': 'hippity/unknown',
      },
      body: { message: 'hello world' },
    },
    request: expect.anything(),
  })
})

it('Patches JSON', async () => {
  const result = await client.patch('/api/reflect', { message: 'hello world' })

  expect(result).toEqual({
    success: true,
    status: 200,
    message: 'OK',
    headers: {
      connection: 'close',
      'content-length': '275',
      'content-type': 'application/json; charset=utf-8',
      date: expect.any(String),
    },
    body: {
      url: '/api/reflect',
      method: 'PATCH',
      headers: {
        accept: 'application/json, text/plain, */*',
        connection: 'close',
        'content-length': '25',
        'content-type': 'application/json;charset=utf-8',
        'user-agent': 'hippity/unknown',
        host: 'localhost:3000',
      },
      body: { message: 'hello world' },
    },
    request: expect.anything(),
  })
})

it('Deletes JSON', async () => {
  const result = await client.delete('/api/reflect')

  expect(result).toEqual({
    success: true,
    status: 200,
    message: 'OK',
    headers: {
      connection: 'close',
      'content-length': '183',
      'content-type': 'application/json; charset=utf-8',
      date: expect.any(String),
    },
    body: {
      url: '/api/reflect',
      method: 'DELETE',
      headers: {
        accept: 'application/json, text/plain, */*',
        'user-agent': 'hippity/unknown',
        connection: 'close',
        host: 'localhost:3000',
      },
      body: {},
    },
    request: expect.anything(),
  })
})
