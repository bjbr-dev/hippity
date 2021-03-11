import { parseHeaders } from './parse-headers'

describe('parseHeaders', function () {
  it('Returns empty object if headers is empty', function () {
    expect(parseHeaders('')).toEqual({})
  })

  it('should parse headers', function () {
    const date = new Date().toISOString()
    const result = parseHeaders(
      `Date: ${date}\n` +
        'Content-Type: application/json\n' +
        'Connection: keep-alive\n' +
        'Transfer-Encoding: chunked'
    )

    expect(result).toEqual({
      ['date']: date,
      ['content-type']: 'application/json',
      ['connection']: 'keep-alive',
      ['transfer-encoding']: 'chunked',
    })
  })

  it('Parses single set-cookie as single array', function () {
    const result = parseHeaders('Set-Cookie: key=val;')
    expect(result).toEqual({ 'set-cookie': ['key=val;'] })
  })

  it('should use array for set-cookie', function () {
    const result = parseHeaders(
      'Set-Cookie: key=val;\nSet-Cookie: key2=val2;\n'
    )
    expect(result).toEqual({ 'set-cookie': ['key=val;', 'key2=val2;'] })
  })

  it('should handle duplicates properly', function () {
    const result = parseHeaders(
      'Age: age-a\nAge: age-b\nFoo: foo-a\nFoo: foo-b\n'
    )

    expect(result).toEqual({
      age: 'age-a', // age is in ignore duplicates blacklist
      foo: 'foo-a, foo-b',
    })
  })

  it('should handle different new line types', function () {
    const result = parseHeaders('a: 1\r\nb: 2\nc: 3\n')
    expect(result).toEqual({ a: '1', b: '2', c: '3' })
  })

  it('should handle empty header', function () {
    const result = parseHeaders('a: 1\n\nb: 2\n')
    expect(result).toEqual({ a: '1', b: '2' })
  })

  it('should handle header with empty value', function () {
    const result = parseHeaders('a:\nb: 2\n')
    expect(result).toEqual({ a: '', b: '2' })
  })

  it('should handle header with no value', function () {
    const result = parseHeaders('a\nb: 2\n')
    expect(result).toEqual({ b: '2' })
  })
})
