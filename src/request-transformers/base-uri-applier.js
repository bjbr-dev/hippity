export function baseUriApplier(baseUri) {
  return request => {
    return { baseUri: baseUri, ...request }
  }
}
