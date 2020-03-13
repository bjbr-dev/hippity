import Koa from 'koa'
import serveStatic from 'koa-static'
import mount from 'koa-mount'
import render from 'koa-ejs'
import { join } from 'path'
import Router from '@koa/router'

const router = new Router()
  .get('/api/hello', ctx => (ctx.body = { message: 'hello world' }))
  .get('/api/sleep', async ctx => {
    const ms = parseInt(ctx.request.query.ms || '1000')
    await new Promise(resolve => setTimeout(resolve, Math.min(ms, 10000)))
    ctx.body = { message: 'OK' }
  })
  .get('/heartbeat', ctx => (ctx.body = { message: 'OK' }))

const app = new Koa()
render(app, {
  root: join(__dirname, 'examples'),
  cache: false
})

app
  .use(mount('/dist', serveStatic('./dist')))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(async ctx => await ctx.render(ctx.path.substr(1)))
  .listen(3000)

console.log('listening on 3000')
