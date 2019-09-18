import Qs from 'qs';
import semver from 'semver';

import pkg from "../package";

const __version = semver(pkg.version);

export default {
  app: {
    name: pkg.name,
    docs: pkg.homepage,
    version: pkg.version,
    semver: {
      major: __version.major,
      minor: __version.minor,
      patch: __version.patch
    },
    env: `${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`
  },
  host: 'localhost',
  port: process.env.PORT,
  query: {
    parser: (query) => Qs.parse(query)
  },
  router: {
    isCaseSensitive: false,
    stripTrailingSlash: true
  },
  uri: `https://api.spotparking.com.sg/v${__version.major}.${__version.minor}`
};