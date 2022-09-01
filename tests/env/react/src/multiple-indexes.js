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
  Index,
} from 'react-instantsearch-dom'

import './App.css'
import { instantMeiliSearch } from '../../../../src/index'

const searchClient = instantMeiliSearch('http://localhost:7700', 'masterKey', {
  paginationTotalHits: 60,
  primaryKey: 'id',
})

const MultipleIndexes = () => (
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
      <SearchBox />
      <Index indexName="steam-video-games">
        <Configure hitsPerPage={2} />
        <InfiniteHits hitComponent={GameHit} />
      </Index>

      <Index indexName="books">
        <Configure hitsPerPage={2} />
        <InfiniteHits hitComponent={BookHit} />
      </Index>
    </InstantSearch>
  </div>
)

const GameHit = ({ hit }) => {
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
const BookHit = ({ hit }) => {
  return (
    <div key={hit.id}>
      <div className="hit-name">
        <Highlight attribute="title" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="comment" hit={hit} />
      </div>
    </div>
  )
}

export { MultipleIndexes }
