import Qs from 'qs';
import semver from 'semver';

import apiConfig from './api';

const __version = semver(apiConfig.version);

export default {
  app: {
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