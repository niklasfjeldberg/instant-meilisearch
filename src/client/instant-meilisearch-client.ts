import { MeiliSearch } from 'meilisearch'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  AlgoliaSearchResponse,
  AlgoliaMultipleQueriesQuery,
  FacetDistribution,
} from '../types'
import { search } from '../search'
import { SearchResolver } from '../adapter'
import { SearchCache } from '../cache/'
import { constructClientAgents } from './agents'

interface ClientInterface {
  name: string
  age: number
  greet(greeting: string): string
}
/**
 * Instanciate SearchClient required by instantsearch.js.
 *
 * @param  {string} hostUrl
 * @param  {string} apiKey
 * @param  {InstantMeiliSearchOptions={}} meiliSearchOptions
 * @returns {InstantMeiliSearchInstance}
 */
export function instantMeiliSearch(
  this: ClientInterface,
  hostUrl: string,
  apiKey = '',
  instantMeiliSearchOptions: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  const clientAgents = constructClientAgents(
    instantMeiliSearchOptions.clientAgents
  )

  const meilisearchClient = new MeiliSearch({
    host: hostUrl,
    apiKey: apiKey,
    clientAgents,
  })

  // do the same for facet distribution
  const searchCache = SearchCache()
  // create search resolver with included cache
  const searchResolver = SearchResolver(meilisearchClient, searchCache)

  let defaultFacetDistributions: Record<string, FacetDistribution>
  // let defaultFacetDistribution: FacetDistribution

  return {
    clearCache: () => searchCache.clearCache(),
    /**
     * @param  {readonlyAlgoliaMultipleQueriesQuery[]} instantSearchRequests
     * @returns {Array}
     */
    search: async function <T = Record<string, any>>(
      instantSearchRequests: readonly AlgoliaMultipleQueriesQuery[]
    ): Promise<{ results: Array<AlgoliaSearchResponse<T>> }> {
      try {
        // console.log(JSON.stringify(instantSearchRequests, null, 2))
        // debugger
        const indexes: string[] = []
        const results = []
        console.log({ instantSearchRequests })

        console.log({ defaultFacetDistributions })

        for (const indexRequest of instantSearchRequests) {
          // console.log(`INDEXES: ${JSON.stringify(indexes)}`)
          const searchRequest = indexRequest
          // console.log({ searchRequest })
          // console.log(indexes.includes(indexRequest.indexName))

          // Will be removed once disjunctive facet search is introduced
          if (!indexes.includes(indexRequest.indexName)) {
            const searchResponse = await search(
              searchRequest,
              instantMeiliSearchOptions,
              defaultFacetDistributions,
              searchResolver
            )
            results.push(searchResponse)
            indexes.push(indexRequest.indexName)
          }
        }
        return { results }
      } catch (e: any) {
        console.error(e)
        throw new Error(e)
      }
    },
    searchForFacetValues: async function (_: any) {
      return await new Promise((resolve, reject) => {
        reject(
          new Error('SearchForFacetValues is not compatible with Meilisearch')
        )
        resolve([]) // added here to avoid compilation error
      })
    },
  }
}
