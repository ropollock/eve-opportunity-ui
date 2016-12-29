function priceHistoryComponent() {
  return {
    templateUrl: 'market-browser/price-history-tpl.html',
    controllerAs: 'priceHistory',
    controller: 'priceHistoryController',
    bindings: {
      days: '<'
    }
  };
}

export default {
  name: 'priceHistory',
  fn: priceHistoryComponent
};
