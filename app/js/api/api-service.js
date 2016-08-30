
function apiService($http, AppSettings) {
  'ngInject'

  const TRADE_HUBS_ENDPOINT = '/tradehubs';
  const OHLC_ENDPOINT = '/ohlc';
  const METHODS = {
    GET:    'GET',
    POST:   'POST',
    PUT:    'PUT',
    DELETE: 'DELETE'
  };

  const service = {};

  service.getTradeHubs = getTradeHubs;
  service.getOHLC = getOHLC;

  return service;

  function getTradeHubs() {
    let httpCfg = {};

    httpCfg.endpoint = TRADE_HUBS_ENDPOINT;
    httpCfg.method = METHODS.GET;

    return request.call(httpCfg);
  }

  function getOHLC(itemId, tradeHubName, buy = false) {
    let httpCfg = {};

    httpCfg.endpoint = OHLC_ENDPOINT;
    httpCfg.method = METHODS.POST;
    httpCfg.data = {
      itemId: itemId,
      tradeHubName: tradeHubName,
      buy: buy
    };

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
