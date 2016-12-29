function priceHistoryController($scope, $log, marketChartsService) {
  'ngInject'
  const vm = this;

  // Price History constants
  const PRICE_HISTORY_AVERAGE = 'priceHistoryAverage';
  const PRICE_HISTORY_SMA5 = 'priceHistorySMA5';
  const PRICE_HISTORY_SMA20 = 'priceHistorySMA20';

  // Form data structure
  vm.form = {
    selectedType: PRICE_HISTORY_AVERAGE,
    types: [{name: 'Average', value: PRICE_HISTORY_AVERAGE},
      {name: '5 day moving average', value: PRICE_HISTORY_SMA5},
      {name: '20 day moving average', value: PRICE_HISTORY_SMA20}],
    loadType: loadType
  };

  // Highcharts directive config
  vm.config = marketChartsService.createDefaultPriceHistoryConfig();

  // Price history chart series
  vm.data = {
    averageSeries: [],
    sma5DaySeries: [],
    sma20DaySeries: []
  };

  activate();

  function activate() {
    watchForUpdatedDays();
    vm.form.selectedType = PRICE_HISTORY_AVERAGE;
    loadType(vm.config, vm.data, PRICE_HISTORY_AVERAGE);
  }

  function watchForUpdatedDays() {
    $scope.$watch(() => {return $scope.priceHistory.days}, (days) => {
      if(days) {
        clearSeries(vm.config);
        clearSeriesData(vm.data);
        generateSeries(vm.data, days);
        vm.form.selectedType = PRICE_HISTORY_AVERAGE;
        loadType(vm.config, vm.data, PRICE_HISTORY_AVERAGE);
      }
    });
  }

  function generateSeries(data, days) {
    data.averageSeries = generateAverageSeries(days);
    data.sma5DaySeries = generateSMA5DaySeries(days);
    data.sma20DaySeries = generateSMA20DaySeries(days);
  }

  function generateAverageSeries(days) {
    let averageSeries = [];
    // Add average line for price History
    averageSeries.push(marketChartsService.createAverageSeries(days));
    // Add upper std dev for price history
    averageSeries.push(marketChartsService.createUpperBollingerBandSeries(days));
    // Add lower std dev for price history
    averageSeries.push(marketChartsService.createLowerBollingerBandSeries(days));
    return averageSeries;
  }

  function generateSMA5DaySeries(days) {
    let sma5DaySeries = [];
    let dayCount = 5;
    if(days.length > dayCount) {
      // Add 5 day SMA line for price history
      sma5DaySeries.push(marketChartsService.create5DaySMASeries(days));
      // Add 5 day upper std dev for price history
      sma5DaySeries.push(marketChartsService.createUpperMovingBollingerBandSeries(days, dayCount));
      // Add 5 day lower std dev for price history
      sma5DaySeries.push(marketChartsService.createLowerMovingBollingerBandSeries(days, dayCount));
    }
    return sma5DaySeries;
  }

  function generateSMA20DaySeries(days) {
    let sma20DaySeries = [];
    let dayCount = 20;
    if(days.length > dayCount) {
      // Add 20 day SMA line for price history
      sma20DaySeries.push(marketChartsService.create20DaySMASeries(days));
      // Add 20 day upper std dev for price history
      sma20DaySeries.push(marketChartsService.createUpperMovingBollingerBandSeries(days, dayCount));
      // Add 20 day lower std dev for price history
      sma20DaySeries.push(marketChartsService.createLowerMovingBollingerBandSeries(days, dayCount));
    }
    return sma20DaySeries;
  }

  function loadType(config, data, selectedType) {
    if(selectedType === PRICE_HISTORY_AVERAGE) {
      config.series = data.averageSeries;
    }
    else if(selectedType === PRICE_HISTORY_SMA5) {
      config.series = data.sma5DaySeries;
    }
    else if(selectedType === PRICE_HISTORY_SMA20) {
      config.series = data.sma20DaySeries;
    }
    else {
      $log.error('Unknown price history type selected.', selectedType);
    }

    // This is a work around for a bug in ng highcharts; the navigator doesn't update without this
    config.options.chart.toggleModify = !config.options.chart.toggleModify;
  }

  function clearSeries(config) {
    config.series = [];
  }

  function clearSeriesData(data) {
    data.averageSeries = [];
    data.sma5DaySeries = [];
    data.sma20DaySeries = [];
  }
}

export default {
  name: 'priceHistoryController',
  fn: priceHistoryController
};
