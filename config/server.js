import Qs from 'qs';
import semver from 'semver';

import apiConfig from './api';

const __version = semver(apiConfig.version);

export default {
  app: {
    staticConfigKey: "staticConfigValue"
  },
  host: 'localhost',
  port: 3000,
  query: {
    parser: (query) => Qs.parse(query)
  },
  router: {
    isCaseSensitive: false,
    stripTrailingSlash: true
  },
  uri: `https://api.spotparking.com.sg/v${__version.major}.${__version.minor}`
};