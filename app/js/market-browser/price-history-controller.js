function priceHistoryController($scope, $log, marketChartsService) {
  'ngInject'
  const vm = this;

  // Price History constants
  const PRICE_HISTORY_AVERAGE = 'priceHistoryAverage';
  const PRICE_HISTORY_SMA5 = 'priceHistorySMA5';
  const PRICE_HISTORY_SMA20 = 'priceHistorySMA20';

  vm.PRICE_HISTORY_AVERAGE = PRICE_HISTORY_AVERAGE;
  vm.PRICE_HISTORY_SMA5 = PRICE_HISTORY_SMA5;
  vm.PRICE_HISTORY_SMA20 = PRICE_HISTORY_SMA20;

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

  vm.generateSeries = generateSeries;
  vm.generateAverageSeries = generateAverageSeries;
  vm.generateSMA5DaySeries = generateSMA5DaySeries;
  vm.generateSMA20DaySeries = generateSMA20DaySeries;
  vm.getDefaultType = getDefaultType;
  vm.loadType = loadType;
  vm.clearSeries = clearSeries;
  vm.clearSeriesData = clearSeriesData;

  activate();

  function activate() {
    watchForUpdatedDays();
    vm.form.selectedType = getDefaultType();
    loadType(vm.config, vm.data, vm.form.selectedType);
  }

  /**
   * watchForUpdatedDays
   *
   * Applies a watch for updated OHLC days and regenerates series data accordingly.
   */
  function watchForUpdatedDays() {
    $scope.$watch(() => {return $scope.priceHistory.days}, (days) => {
      if(days) {
        clearSeries(vm.config);
        clearSeriesData(vm.data);
        generateSeries(vm.data, days);
        vm.form.selectedType = getDefaultType();
        loadType(vm.config, vm.data, vm.form.selectedType);
      }
    });
  }

  /**
   * generateSeries
   *
   * Sets a view model data object's averageSeries, sma5DaySeries, and sma20DaySeries properties
   * generated using an OHLC days collection.
   *
   * @param data
   * @param days
   */
  function generateSeries(data, days) {
    data.averageSeries = generateAverageSeries(days);
    data.sma5DaySeries = generateSMA5DaySeries(days);
    data.sma20DaySeries = generateSMA20DaySeries(days);
  }

  /**
   * generateAverageSeries
   *
   * Creates an array of highchart series for the average along with upper and lower Bollinger bands.
   *
   * @param days
   * @return {Array}
   */
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

  /**
   * generateSMA5DaySeries
   *
   * Creates an array of highchart series for a simple moving average of 5 days along with
   * upper and lower Bollinger bands.
   *
   * @param days
   * @return {Array}
   */
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

  /**
   * generateSMA20DaySeries
   *
   * Creates an array of highchart series for a simple moving average of 20 days along with
   * upper and lower Bollinger bands.
   *
   * @param days
   * @return {Array}
   */
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

  /**
   * getDefaultType
   *
   * Returns the default price history type. (Average)
   *
   * @return {string}
   */
  function getDefaultType() {
    return PRICE_HISTORY_AVERAGE;
  }

  /**
   * loadType
   *
   * Sets the series property of a config object to the corresponding data set by matching a type.
   * Applies a work around for a bug in the highcharts directive. The work around toggles a chart option
   * to ensure the directive refreshes properly.
   *
   * @param config
   * @param data
   * @param selectedType
   */
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
      $log.error('Unrecognized price history type selected.', selectedType);
    }

    // This is a work around for a bug in ng highcharts; the navigator doesn't update without this
    config.options.chart.toggleModify = !config.options.chart.toggleModify;
  }

  /**
   * clearSeries
   *
   * Sets the series property of a config object to an empty array.
   *
   * @param config
   */
  function clearSeries(config) {
    config.series = [];
  }

  /**
   * clearSeriesData
   *
   * Sets averageSeries, sma5DaySeries, and sma20DaySeries to empty arrays.
   *
   * @param {Object} data
   */
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
