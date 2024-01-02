import { graphql, http, HttpResponse } from 'msw'

import { mockApi } from '~/utils'

export const posts = []

const jsonPlaceHolder = graphql.link('https://jsonplaceholder.ir/graphql')
// Define handlers that catch the corresponding requests and returns the mock data.
export const handlers: any[] = [
  http.get(`${mockApi}/empty.json`, () => {
    return new HttpResponse(JSON.stringify({}), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),

  jsonPlaceHolder.query('posts', () => {
    return HttpResponse.json({
      data: {
        posts
      }
    })
  })
]
