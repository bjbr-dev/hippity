# Contributing

We are open to, and grateful for, any contributions made by the community. By contributing, you agree to abide by the [code of conduct](./CODE_OF_CONDUCT.md).

### Code Style

Please follow the [prettier](https://github.com/prettier/prettier) and [eslint](https://eslint.org/) styles configured in the source code.

### Testing

Please update the tests to reflect your code changes. Pull requests will not be accepted if they are failing on [GitHub CI](https://github.com/berkeleybross/hippity/pipelines).

### Documentation

Please update the docs accordingly so that there are no discrepencies between the API and the documentation.

### Developing

#### VSCode

- `Install NPM packages` Installs NPM packages, should be run whenever the branch changes (due to switch or pull)
- `Start` watch for changes and restart the server (on http://localhost:3000/)
- `Build` Runs the build & lint scripts
- `Lint es` Runs eslint
- `Run tests` Runs all tests - requires `Dev` to be running
- `Watch tests` watch for changes and run all tests - requires `Dev` to be running

#### Command line

- `npm start` Start the examples server, also used in integration tests
- `npm run test` run all unit tests (requires the server to be started)
- `npm run test:watch` watch for changes and run all unit tests

### Releasing

A new version is automatically released by GitHub when the master branch is tagged. Versions should follow [semantic versioning](http://semver.org/).

### Running Examples

Examples are included in part to allow manual testing.

```bash
$ npm start
# Open 127.0.0.1:3000
```
