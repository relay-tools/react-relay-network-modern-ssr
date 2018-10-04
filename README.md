# SSR middleware for [react-relay-network-modern](https://github.com/relay-tools/react-relay-network-modern) (for Relay Modern)

[![](https://img.shields.io/npm/v/react-relay-network-modern-ssr.svg)](https://www.npmjs.com/package/react-relay-network-modern-ssr)
[![npm](https://img.shields.io/npm/dt/react-relay-network-modern-ssr.svg)](http://www.npmtrends.com/react-relay-network-modern-ssr)
[![Travis](https://img.shields.io/travis/relay-tools/react-relay-network-modern-ssr.svg?maxAge=2592000)](https://travis-ci.org/relay-tools/react-relay-network-modern-ssr)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![FlowType compatible](https://img.shields.io/badge/flowtype-compatible-brightgreen.svg)

**For a full examples, see**:

- https://github.com/damassi/react-relay-network-modern-ssr-example
- https://github.com/damassi/react-relay-network-modern-ssr-todomvc

# Server

```js
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { RelayNetworkLayer } from 'react-relay-network-modern';
import RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';
import serialize from 'serialize-javascript';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import schema from './schema';

const app = express();

app.get('/*', async (req, res, next) => {
  const relayServerSSR = new RelayServerSSR();

  const network = new RelayNetworkLayer([
    // There are three possible ways relayServerSSR.getMiddleware() can be used;
    // choose the one that best matches your context:

    // By default, if called without arguments it will use `fetch` under the hood
    // to request data. (See https://github.com/relay-tools/react-relay-network-modern
    // for more info)
    relayServerSSR.getMiddleware(),

    // OR, you can directly pass in a GraphQL schema, which will use `graphql`
    // from `graphql-js` to request data
    relayServerSSR.getMiddleware({
      schema,
      contextValue: {},
    }),

    // OR, if you need to prepare context in async mode, `getMiddleware` will also
    // accept a function:
    relayServerSSR.getMiddleware(async () => ({
      schema,
      contextValue: await prepareGraphQLContext(req),
    })),
  ]);
  const source = new RecordSource();
  const store = new Store(source);
  const relayEnvironment = new Environment({ network, store });

  // Once the RelayEnvironment is instantiated, two App renders need to be made in
  // order to prepare data for hydration:

  // First, kick off Relay requests with an initial render
  ReactDOMServer.renderToString(<App relayEnvironment={relayEnvironment} />);

  // Second, await while all data were recieved from graphql server
  const relayData = await relayServerSSR.getCache();

  // Third, render the app a second time now that the Relay store has been primed
  // and send HTML and bootstrap data to the client for rehydration.
  const appHtml = ReactDOMServer.renderToString(
    <App
      relayEnvironment={new Environment({
        network: Network.create(() => relayData[0][1]),
        store,
      })}
    />
  );

  try {
      res.status(200).send(`
      <html>
        <body>
          <div id="react-root">${appHtml}</div>
          <script>
            window.__RELAY_BOOTSTRAP_DATA__ = ${serialize(relayData)};
          </script>
          <script src="/assets/bundle.js"></script>
        </body>
      </html>
    `);
  } catch (error) {
    console.log('(server.js) Error: ', error);
    next(error);
  }
}

app.listen(3000);

// simple example, how to asynchronously prepare data for GraphQL context
async function prepareGraphQLContext(req) {
  const { userToken } = req.cookies;
  const user = userToken ? (await somehowLoadUser(userToken)) : undefined;
  return {
    user,
    req,
  }
}
```

# Client

```js
import { RelayNetworkLayer } from 'react-relay-network-modern';
import RelayClientSSR from 'react-relay-network-modern-ssr/lib/client';

const relayClientSSR = new RelayClientSSR(window.__RELAY_BOOTSTRAP_DATA__);

const network = new RelayNetworkLayer([
  relayClientSSR.getMiddleware({
    // Will preserve cache rather than purge after mount.
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
  document.getElementById('react-root')
);
```

# Contribute

I actively welcome pull requests with code and doc fixes.

[CHANGELOG](https://github.com/relay-tools/react-relay-network-modern-ssr/blob/master/CHANGELOG.md)

# License

[MIT](https://github.com/relay-tools/react-relay-network-modern-ssr/blob/master/LICENSE.md)
