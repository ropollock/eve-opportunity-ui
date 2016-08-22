
function apiService($http, AppSettings) {
  'ngInject'

  const TRADE_HUBS_ENDPOINT = '/tradehubs';
  const METHODS = {
    GET:    'GET',
    POST:   'POST',
    PUT:    'PUT',
    DELETE: 'DELETE'
  };

  const service = {};

  service.getTradeHubs = getTradeHubs;

  return service;

  function getTradeHubs() {
    var httpCfg = {};

    httpCfg.endpoint = TRADE_HUBS_ENDPOINT;
    httpCfg.method = METHODS.GET;

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
    httpRequest.url = AppSettings.API_URL + this.endpoint;
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
  name: 'apiService',
  fn: apiService
}
