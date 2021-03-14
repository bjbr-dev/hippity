# Hippity

Perform HTTP requests (preferably REST style!) from NodeJS or client-side javascript.

## Features

- Simple interface backed by _middleware_ for complete flexibility
- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) based, with abort support
- Automatic JSON serialization
- Optional, automatic validation of server responses

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Latest ✔                                                                                 | Latest ✔                                                                                    | Latest ✔                                                                                 | Latest ✔                                                                              | Latest ✔                                                                           | 11 ✔                                                                                                                         |

## Installing

Using npm:

```bash
$ npm install hippity
```

_Until this project reaches a `1.0` release, breaking changes will be released with a new minor version. For example `0.5.1`, and `0.5.4` will have the same API, but `0.6.0` will have breaking changes._

### Examples

Perform a `GET` request. The following performs a `GET` to `/api/search?term=foo%20bar`, and throws an error if the response code is not "success" (between 200 and 300)

```js
return await this.client.$get(['/api/search', { term: 'foo bar' }])
```

Perform a `PUT` request. The following performs a `PUT` to '/api/users/5' with JSON body of `{ "name": "John Smith" }`.

It will throw an error only if their was an HTTP transport error (e.g. network disconnected). Otherwise it will return an enum (string) describing the result

```js
async function example() {
  const response = await this.client.put(['/api/users/{id}', { id: 5 }], {
    name: 'John Smith',
  })

  // Could also check response.success !== false
  if (response.status === 201) {
    return 'Created'
  } else {
    return 'Unknown error'
  }
}
```

For more examples, please read [the Wiki](https://github.com/berkeleybross/hippity/wiki).

## Report Issues

For any issues or feature requests, we would really appreciate it if you report
them using our [issue tracker](https://github.com/berkeleybross/hippity/issues).

## Contributing

We are open to, and grateful for, any contributions made by the community. By contributing, you agree to abide by the [code of conduct](./CODE_OF_CONDUCT.md).

For more information, please check [CONTRIBUTING.md](CONTRIBUTING.md)

## Licensing

Released under The MIT [License](./LICENSE). Copyright (c) berkeleybross.

## Credits

Hippity is made possible by other [open source software](NOTICE.md).
