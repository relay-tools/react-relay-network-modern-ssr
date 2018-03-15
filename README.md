SSR middleware for `react-relay-network-modern` (for Relay Modern)
==========================================
[![](https://img.shields.io/npm/v/react-relay-network-modern-ssr.svg)](https://www.npmjs.com/package/react-relay-network-modern-ssr)
[![npm](https://img.shields.io/npm/dt/react-relay-network-modern-ssr.svg)](http://www.npmtrends.com/react-relay-network-modern-ssr)
[![Travis](https://img.shields.io/travis/nodkz/react-relay-network-modern-ssr.svg?maxAge=2592000)](https://travis-ci.org/nodkz/react-relay-network-modern-ssr)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![FlowType compatible](https://img.shields.io/badge/flowtype-compatible-brightgreen.svg)


Server
=======
```js
import { graphql } from 'graphql';
import { RelayNetworkLayer } from 'react-relay-network-modern';
import RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';
import schema from './schema';

const relayServerSSR = new RelayServerSSR();

const network = new RelayNetworkLayer([
  relayServerSSR.getMiddleware({
    schema,
    contextValue: {},
  }),
  // OR if you need to prepare context in async mode
  // relayServerSSR.getMiddleware(async () => ({
  //   schema,
  //   contextValue: await prepareGraphQLContext(),
  // })),
]);

//  ... first APP render for starting relay queries
// ReactDOMServer.renderToString(<App />);

const relayData: string = await relayServerSSR.getCache();

//  ... second APP render with already loaded payload
// const appHtml = ReactDOMServer.renderToString(<App />);
// sendHtml(appHtml, relayData);
```

Client
======
```js
import { RelayNetworkLayer } from 'react-relay-network-modern';
import RelayClientSSR from 'react-relay-network-modern-ssr/lib/client';

const relayClientSSR = new RelayClientSSR(window.relayData);

const network = new RelayNetworkLayer([
  relayClientSSR.getMiddleware(),
]);
```

Contribute
==========
I actively welcome pull requests with code and doc fixes.

[CHANGELOG](https://github.com/nodkz/react-relay-network-modern-ssr/blob/master/CHANGELOG.md)


License
=======
[MIT](https://github.com/nodkz/react-relay-network-modern-ssr/blob/master/LICENSE.md)
