# RestClient

[![npm version](https://img.shields.io/npm/v/@berkeleybross/restclient.svg?style=flat-square)](https://www.npmjs.org/package/@berkeleybross/restclient)
[![npm downloads](https://img.shields.io/npm/dm/@berkeleybross/restclient.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@berkeleybross/restclient)
[![Build Status](https://travis-ci.org/berkeleybross/restclient.js.svg?branch=master)](https://travis-ci.org/berkeleybross/restclient.js)

Perform HTTP requests (preferably REST style!) from NodeJS or client-side javascript.

## Features

- Simple interface backed by _middleware_ for complete flexibility
- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) based, with cancellation support
- Automatic JSON serialization
- Optional, automatic validation of server responses

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Latest ✔                                                                                 | Latest ✔                                                                                    | Latest ✔                                                                                 | Latest ✔                                                                              | Latest ✔                                                                           | 11 ✔                                                                                                                         |

## Installing

Using npm:

```bash
$ npm install @berkeleybross/restclient
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
  const response = await this.client.$put(['/api/users/{id}', { id: 5 }], {
    name: 'John Smith'
  })

  if (response.status === 201) {
    return 'Created'
  } else {
    return 'Unknown error'
  }
}
```

For more examples, please read the Wiki.

## Report Issues

For any issues or feature requests, we would really appreciate it if you report
them using our [issue tracker](https://github.com/berkeleybross/restclient.js/issues).

## Contributing

Contributing to Coding with Chrome is subject to the guidelines in the
[CONTRIBUTING.md](CONTRIBUTING.md) file, which, in brief, requires that
contributors sign the [Individual Contributor License Agreement (CLA)][3].

For more information about develop for Coding with Chrome, please check
[doc/DEVELOPMENT.md](doc/DEVELOPMENT.md)

## Licensing

Released under The MIT [License](./LICENSE). Copyright (c) berkeleybross.

## Credits

RestClient is made possible by other [open source software](NOTICE.md).
