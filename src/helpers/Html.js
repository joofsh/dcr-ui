import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

import Server from './Server';
import config from '../../config';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object
  };

  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';

    let clientJS;
    if (!__DISABLE_CSR__) {
      clientJS = <script src={assets.javascript.main} charSet="UTF-8"/>;
    }

    // TODO: Refactor this into production compiled CSS
    let bootstrapCSS = (
      <link
        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
        rel="stylesheet" type="text/css" charSet="UTF-8"
      />);

    const head = Helmet.rewind();
    return (
      <html lang="en-us">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32"/>
          <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16"/>
          <link rel="manifest" href="/manifest.json"/>
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
          <meta name="theme-color" content="#ffffff"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          { bootstrapCSS }
          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, key) =>
            <link
              href={assets.styles[style]}
              key={key}
              media="screen, projection"
              rel="stylesheet" type="text/css" charSet="UTF-8"
            />
          )}

          {/* (will be present only in development mode) */}
          {/* outputs a <style/> tag with all bootstrap styles + App.scss */}
          {/* can smoothen the initial style flash (flicker) on page load in dev mode */}
          {/* TODO: Include styles for the current page too */}
          { Object.keys(assets.styles).length === 0 ?
            <style
              dangerouslySetInnerHTML={{ __html: require('../containers/App/App.scss')._style }}
            /> : null }
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: content }}/>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__INITIAL_STATE__=${serialize(store.getState())};`
            }}
            charSet="UTF-8"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__INITIAL_PROPS__=${serialize(Server.initialProps())};`
            }}
            charSet="UTF-8"
          />
          <script
            src={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${config.googleMapsAPIKey}`}
          >
      </script>
          { clientJS }
        </body>
      </html>
    );
  }
}
