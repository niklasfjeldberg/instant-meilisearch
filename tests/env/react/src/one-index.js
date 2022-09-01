import 'instantsearch.css/themes/algolia-min.css'
import React from 'react'
import {
  InstantSearch,
  InfiniteHits,
  SearchBox,
  Stats,
  Highlight,
  ClearRefinements,
  RefinementList,
  Configure,
  SortBy,
  Snippet,
} from 'react-instantsearch-dom'

import './App.css'
import { instantMeiliSearch } from '../../../../src/index'

const searchClient = instantMeiliSearch('http://localhost:7700', 'masterKey', {
  paginationTotalHits: 60,
  primaryKey: 'id',
  keepZeroFacets: true,
  placeholderSearch: false,
})

const OneIndex = () => (
  <div className="ais-InstantSearch">
    <h1>Meilisearch + React InstantSearch</h1>
    <h2>
      Search in Steam video games{' '}
      <span role="img" aria-label="emoji">
        🎮
      </span>
    </h2>
    <p>
      This is not the official Steam dataset but only for demo purpose. Enjoy
      searching with Meilisearch!
    </p>
    <InstantSearch indexName="steam-video-games" searchClient={searchClient}>
      <Stats />
      <div className="left-panel">
        <ClearRefinements />
        <SortBy
          defaultRefinement="steam-video-games"
          items={[
            { value: 'steam-video-games', label: 'Relevant' },
            {
              value: 'steam-video-games:recommendationCount:desc',
              label: 'Most Recommended',
            },
            {
              value: 'steam-video-games:recommendationCount:asc',
              label: 'Least Recommended',
            },
          ]}
        />
        <h2>Genres</h2>
        <RefinementList attribute="genres" operator="and" />
        <h2>Players</h2>
        <RefinementList attribute="players" operator="and" />
        <h2>Platforms</h2>
        <RefinementList attribute="platforms" operator="and" />
        <h2>Misc</h2>
        <RefinementList attribute="misc" operator="and" />
        <Configure
          hitsPerPage={6}
          attributesToSnippet={['description:50']}
          snippetEllipsisText={'...'}
        />
      </div>
      <div className="right-panel">
        <SearchBox />
        <InfiniteHits hitComponent={Hit} />
      </div>
    </InstantSearch>
  </div>
)

const Hit = ({ hit }) => {
  return (
    <div key={hit.id}>
      <div className="hit-name">
        <Highlight attribute="name" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="genres" hit={hit} />
      </div>
      <img src={hit.image} align="left" alt={hit.name} />
      <div className="hit-name">
        <Snippet attribute="description" hit={hit} />
      </div>
      <div className="hit-info">
        <b>price:</b> {hit.price}
      </div>
      <div className="hit-info">
        <b>release date:</b> {hit.releaseDate}
      </div>
      <div className="hit-info">
        <b>Recommended:</b> {hit.recommendationCount}
      </div>
    </div>
  )
}

export { OneIndex }
