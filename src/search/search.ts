import {
  AlgoliaMultipleQueriesQuery,
  InstantMeiliSearchOptions,
  FacetDistribution,
  SearchContext,
} from '../types'

import { createSearchContext } from '../contexts'
import { adaptSearchParams, adaptSearchResponse } from '../adapter'
import { cacheFirstFacetDistribution } from '../cache'

export async function search(
  searchRequest: AlgoliaMultipleQueriesQuery,
  instantMeiliSearchOptions: InstantMeiliSearchOptions,
  defaultFacetDistributions: Record<string, FacetDistribution>,
  searchResolver: any
) {
  const searchContext: SearchContext = createSearchContext(
    searchRequest,
    instantMeiliSearchOptions,
    defaultFacetDistributions
  )

  // Adapt search request to Meilisearch compliant search request
  const adaptedSearchRequest = adaptSearchParams(searchContext)

  // console.log({ adaptedSearchRequest })

  // Cache first facets distribution of the instantMeilisearch instance
  // Needed to add in the facetDistribution the fields that were not returned
  // When the user sets `keepZeroFacets` to true.
  if (
    !defaultFacetDistributions ||
    defaultFacetDistributions[searchContext.indexUid] === undefined
  ) {
    const defaultFacetDistribution = await cacheFirstFacetDistribution(
      searchResolver,
      searchContext
    )
    defaultFacetDistributions = {
      [searchContext.indexUid]: defaultFacetDistribution,
    }
    searchContext.defaultFacetDistribution =
      defaultFacetDistributions[searchContext.indexUid]
  }

  // Search response from Meilisearch
  const searchResponse = await searchResolver.searchResponse(
    searchContext,
    adaptedSearchRequest
  )

  console.log({ searchResponse })

  // Adapt the Meilisearch responsne to a compliant instantsearch.js response
  const adaptedSearchResponse = adaptSearchResponse<T>(
    searchResponse,
    searchContext
  )

  return adaptedSearchResponse
}
