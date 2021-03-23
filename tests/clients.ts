import { jsonClient, baseUrl, transformMiddleware } from '~/'

export const client = jsonClient.useAt(
  -1,
  transformMiddleware([baseUrl('http://localhost:3000/')])
)
