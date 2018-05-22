SSR middleware for `react-relay-network-modern` (for Relay Modern)
==========================================
[![](https://img.shields.io/npm/v/react-relay-network-modern-ssr.svg)](https://www.npmjs.com/package/react-relay-network-modern-ssr)
[![npm](https://img.shields.io/npm/dt/react-relay-network-modern-ssr.svg)](http://www.npmtrends.com/react-relay-network-modern-ssr)
[![Travis](https://img.shields.io/travis/nodkz/react-relay-network-modern-ssr.svg?maxAge=2592000)](https://travis-ci.org/nodkz/react-relay-network-modern-ssr)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![FlowType compatible](https://img.shields.io/badge/flowtype-compatible-brightgreen.svg)


**For a full examples, see**:
 - https://github.com/damassi/react-relay-network-modern-ssr-example
 - https://github.com/damassi/react-relay-network-modern-ssr-todomvc

Server
=======
```js
import { RelayNetworkLayer } from 'react-relay-network-modern';
import RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';
import schema from './schema';

const relayServerSSR = new RelayServerSSR();

const network = new RelayNetworkLayer([
  // There are three possible ways relayServerSSR.getMiddleware() can be used;
  // choose the one that best matches your context:

  // By default, if called without arguments it will use `fetch` under the hood
  // to request data. (See https://github.com/nodkz/react-relay-network-modern
  // for more info)
  relayServerSSR.getMiddleware(),

  // Or, you can directly pass in a GraphQL schema, which will use `graphql`
  // from `graphql-js` to request data
  relayServerSSR.getMiddleware({
    schema,
    contextValue: {},
  }),

  // If you need to prepare context in async mode, `getMiddleware` will also
  // accept a function:
  relayServerSSR.getMiddleware(async () => ({
    schema,
    contextValue: await prepareGraphQLContext(),
  })),
]);

// Once the RelayNetworkLayer is instantiated, two App renders need to be made in
// order to prepare data for hydration:

// First, kick off Relay requests with an initial render
ReactDOMServer.renderToString(<App />);

// Second, collect the data
const relayData = await relayServerSSR.getCache();

// Third, render the app a second time now that the Relay store has been primed
// and send HTML and bootstrap data to the client for rehydration. (setTimeout is
// used to ensure that async resolution inside of QueryRenderer completes once
// data is provided.
setTimeout(() => {
  const appHtml = ReactDOMServer.renderToString(<App />);
  sendHtml(appHtml, relayData);
}, 0)

```

Client
======
```js
import { RelayNetworkLayer } from 'react-relay-network-modern';
import RelayClientSSR from 'react-relay-network-modern-ssr/lib/client';

const relayClientSSR = new RelayClientSSR(window.relayData);

const network = new RelayNetworkLayer([
  relayClientSSR.getMiddleware({
    // Will preserve cache rather than purge after mount. This works great with
    // cacheMiddleware.
    lookup: false
  }),
]);

...

ReactDOM.render(
  <QueryRenderer
    dataFrom="STORE_THEN_NETWORK" // Required for Relay 1.5
    environment={environment}
    ...
  />,
  mountPoint
)

```
Contribute
==========
I actively welcome pull requests with code and doc fixes.

[CHANGELOG](https://github.com/nodkz/react-relay-network-modern-ssr/blob/master/CHANGELOG.md)


License
=======
[MIT](https://github.com/nodkz/react-relay-network-modern-ssr/blob/master/LICENSE.md)
