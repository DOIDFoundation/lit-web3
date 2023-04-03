import { graphql, rest } from 'msw'

import { mockApi } from '~/utils'

export const posts = []

const jsonPlaceHolder = graphql.link('https://jsonplaceholder.ir/graphql')
// Define handlers that catch the corresponding requests and returns the mock data.
export const handlers = [
  rest.get(`${mockApi}/empty.json`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}))
  }),

  jsonPlaceHolder.query('posts', (req, res, ctx) => {
    return res(
      ctx.data({
        posts
      })
    )
  })
]
