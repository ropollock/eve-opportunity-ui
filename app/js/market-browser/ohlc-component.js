function ohlcComponent() {
  return {
    templateUrl: 'market-browser/ohlc-tpl.html',
    controllerAs: 'ohlc',
    controller: 'ohlcController',
    bindings: {
      days: '<'
    }
  };
}

export default {
  name: 'ohlc',
  fn: ohlcComponent
};
