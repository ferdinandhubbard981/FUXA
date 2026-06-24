declare function require(moduleName: string): any;
export const environment = {
  version: require('../../package.json').version,
  production: true,
  apiEndpoint: '10.30.12.255',
  apiPort: null,
  serverEnabled: true,
  type: null
};
