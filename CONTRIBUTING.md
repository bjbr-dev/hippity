# Contributing

We are open to, and grateful for, any contributions made by the community. By contributing, you agree to abide by the [code of conduct](./CODE_OF_CONDUCT.md).

### Code Style

Please follow the [prettier](https://github.com/prettier/prettier) and [eslint](https://eslint.org/) styles configured in the source code.

### Testing

Please update the tests to reflect your code changes. Pull requests will not be accepted if they are failing on [Travis CI](https://travis-ci.org/berkeleybross/restclient.js).

### Documentation

Please update the docs accordingly so that there are no discrepencies between the API and the documentation.

### Developing

- `npm run test` run all unit tests
- `npm run test -- --watch` watch for changes and run all unit tests

### Releasing

A new version is automatically released by Travis CI by tagging the master branch. Versions should follow [semantic versioning](http://semver.org/).

### Running Examples

Examples are included in part to allow manual testing.

Running example

```bash
$ npm run examples
# Open 127.0.0.1:3000
```

Running sandbox in browser

```bash
$ npm start
# Open 127.0.0.1:3000
```

Running sandbox in terminal

```bash
$ npm start
$ node ./sandbox/client
```
