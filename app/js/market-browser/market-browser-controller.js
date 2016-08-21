
function marketBrowserController($log) {
  'ngInject'

  const vm = this;

  vm.form = {
    loading: true,
    marketTypes: [],
    itemSearchText: '',
    selectedItem: null,
    queryItems: null,
    regions: [],
    regionSearchText: '',
    selectedRegion: null,
    queryRegions: null,
    analysis: null
  };

  vm.analysis = {
    loading: false
  };

  vm.init = {
    marketTypePageCount: 1,
    marketTypePromises: []
  };

  activate();

  function activate() {
    $log.info('Activating MarketBrowserController');
    /*initMarketTypes();
    initRegions();*/
  }
}

export default {
  name: 'marketBrowserController',
  fn: marketBrowserController
};
