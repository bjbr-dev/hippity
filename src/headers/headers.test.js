import {
  findHeader,
  hasHeader,
  addHeaderIfNotPresent,
  addHeadersIfNotPresent,
  replaceHeader
} from './headers'

describe('findHeader', () => {
  it('Returns undefined on empty object', () => {
    expect(findHeader({}, 'header')).toBeUndefined()
  })

  it('Returns undefined when header doesnt match', () => {
    expect(findHeader({ foo: 'bar' }, 'header')).toBeUndefined()
  })

  it('Returns header value', () => {
    expect(findHeader({ header: 'foo' }, 'header')).toBe('foo')
  })

  it('is case insensitive', () => {
    expect(findHeader({ header: 'foo' }, 'HEADER')).toBe('foo')
  })

  it('returns first match arbitrarily', () => {
    const result = findHeader({ header: 'foo', HEADER: 'bar' }, 'header')
    expect(result).toBeOneOf(['foo', 'bar'])
  })
})

describe('hasHeader', () => {
  it('Returns false on empty object', () => {
    expect(hasHeader({}, 'header')).toBeFalse()
  })

  it('Returns false when header doesnt match', () => {
    expect(hasHeader({ foo: 'bar' }, 'header')).toBeFalse()
  })

  it('Returns true when header exists', () => {
    expect(hasHeader({ header: 'foo' }, 'header')).toBeTrue()
  })

  it('is case insensitive', () => {
    expect(hasHeader({ header: 'foo' }, 'HEADER')).toBeTrue()
  })

  it('returns true when any header matches', () => {
    expect(hasHeader({ header: 'foo', HEADER: 'bar' }, 'header')).toBeTrue()
  })
})

describe('addHeaderIfNotPresent', () => {
  it('Adds header to empty object', () => {
    const headers = {}
    addHeaderIfNotPresent(headers, 'foo', 'bar')
    expect(headers).toEqual({ foo: 'bar' })
  })

  it('Adds header to object with another header', () => {
    const headers = { bar: 'baz' }
    addHeaderIfNotPresent(headers, 'foo', 'bar')
    expect(headers).toEqual({ foo: 'bar', bar: 'baz' })
  })

  it('Does not change existing header', () => {
    const headers = { foo: 'baz' }
    addHeaderIfNotPresent(headers, 'foo', 'bar')
    expect(headers).toEqual({ foo: 'baz' })
  })

  it('Does not change existing header capitalization', () => {
    const headers = { FOO: 'baz' }
    addHeaderIfNotPresent(headers, 'foo', 'bar')
    expect(headers).toEqual({ FOO: 'baz' })
  })
})

describe('addHeadersIfNotPresent', () => {
  it('Adds header to empty object', () => {
    const headers = {}
    addHeadersIfNotPresent(headers, { foo: 'bar' })
    expect(headers).toEqual({ foo: 'bar' })
  })

  it('Adds header to object with another header', () => {
    const headers = { bar: 'baz' }
    addHeadersIfNotPresent(headers, { foo: 'bar' })
    expect(headers).toEqual({ foo: 'bar', bar: 'baz' })
  })

  it('Does not change existing header', () => {
    const headers = { foo: 'baz' }
    addHeadersIfNotPresent(headers, { foo: 'bar' })
    expect(headers).toEqual({ foo: 'baz' })
  })

  it('Does not change existing header capitalization', () => {
    const headers = { FOO: 'baz' }
    addHeadersIfNotPresent(headers, { foo: 'bar' })
    expect(headers).toEqual({ FOO: 'baz' })
  })
})

describe('replaceHeader', () => {
  it('Adds header to empty object', () => {
    const headers = {}
    replaceHeader(headers, 'foo', 'bar')
    expect(headers).toEqual({ foo: 'bar' })
  })

  it('Adds header to object with another header', () => {
    const headers = { bar: 'baz' }
    replaceHeader(headers, 'foo', 'bar')
    expect(headers).toEqual({ foo: 'bar', bar: 'baz' })
  })

  it('Changes existing header', () => {
    const headers = { foo: 'baz' }
    replaceHeader(headers, 'foo', 'bar')
    expect(headers).toEqual({ foo: 'bar' })
  })

  it('Does not change existing header capitalization', () => {
    const headers = { FOO: 'baz' }
    replaceHeader(headers, 'foo', 'bar')
    expect(headers).toEqual({ FOO: 'bar' })
  })
})
