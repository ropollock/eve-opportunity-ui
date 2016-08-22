
function crestAPIService($http, AppSettings) {
  'ngInject'

  const MARKET_TYPES_ENDPOINT = '/market/types/';
  const METHODS = {
    GET:    'GET',
    POST:   'POST',
    PUT:    'PUT',
    DELETE: 'DELETE'
  };

  const service = {};

  service.getAllMarketTypes = getAllMarketTypes;

  return service;

  function getAllMarketTypes(page) {
    var httpCfg = {};

    httpCfg.endpoint = MARKET_TYPES_ENDPOINT;
    httpCfg.method = METHODS.GET;

    if(typeof page !== 'undefined') {
      httpCfg.params = {page: page};
    }

    return request.call(httpCfg);
  }

  function request() {
    var httpRequest = {};

    if(!this.method) {
      throw new Error('No method provided for API request : CRESTAPIService');
    }

    if(!this.endpoint) {
      throw new Error('No endpoint provided for API request : CRESTAPIService');
    }

    httpRequest.method = this.method;
    httpRequest.url = AppSettings.CREST_API_URL + this.endpoint;
    httpRequest.isArray = false;

    if(this.data) {
      httpRequest.data = this.data;
    }

    if(this.params) {
      httpRequest.params = this.params;
    }

    if(this.headers) {
      httpRequest.headers = this.headers;
    }

    if(this.responseType) {
      httpRequest.responseType = this.responseType;
    }

    return $http(httpRequest);
  }
}

export default {
  name: 'crestAPIService',
  fn: crestAPIService
};
