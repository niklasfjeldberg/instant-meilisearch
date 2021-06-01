import { instantMeiliSearch } from '../../../src/index'

const search = instantsearch({
  routing: true,
  indexName: 'steam-video-games',
  searchClient: instantMeiliSearch(
    'https://demos.meilisearch.com',
    'dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25',
    {
      limitPerRequest: 30,
    }
  ),
})

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    showLoadingIndicator: false,
  }),
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  instantsearch.widgets.refinementList({
    container: '#genres-list',
    attribute: 'genres',
  }),
  instantsearch.widgets.refinementList({
    container: '#players-list',
    attribute: 'players',
  }),
  instantsearch.widgets.refinementList({
    container: '#platforms-list',
    attribute: 'platforms',
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 6,
  }),
  instantsearch.widgets.refinementList({
    container: '#misc-list',
    attribute: 'misc',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    showPrevious: true,
    templates: {
      item: `
        <div>
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "name", "highlightedTagName": "p" }{{/helpers.highlight}}
          </div>
          <img src="{{image}}" align="left" />
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
          </div>
          <div class="hit-info">price: {{price}}</div>
          <div class="hit-info">release date: {{releaseDate}}</div>
        </div>
      `,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
])

search.start()
