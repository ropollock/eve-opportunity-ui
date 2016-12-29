function ohlcController($scope, $log, marketChartsService, _) {
  'ngInject'
  const vm = this;

  // View model containing the configuration object for a highcharts directive
  vm.config = marketChartsService.createDefaultOHLCConfig();

  activate();

  function activate() {
    watchForUpdatedDays();
  }

  /**
   * watchForUpdatedDays
   *
   * Applies a watch for updated OHLC days and regenerates series data accordingly.
   */
  function watchForUpdatedDays() {
    $scope.$watch(() => {return $scope.ohlc.days}, (days) => {
      if(days) {
        clearSeries(vm.config);
        vm.config.series = generateSeries(days);
        // This is a work around for refreshing highcharts directive
        vm.config.options.chart.toggleModify = !vm.config.options.chart.toggleModify;
      }
    });
  }

  /**
   * generateSeries
   *
   * Creates an array of highcharts series containing an OHLC candlestick series and a volume series
   * using a collection of OHLC days.
   *
   * @param days
   * @return {Array}
   */
  function generateSeries(days) {
    return _.concat(generateCandlestickSeries(days), generateVolumeSeries(days));
  }

  /**
   * generateCandlestickSeries
   *
   * Creates an array of highcharts series containing an OHLC candlestick series using a collection of OHLC days.
   *
   * @param days
   * @return {[*]}
   */
  function generateCandlestickSeries(days) {
    return [marketChartsService.createOHLCSeries(days)];
  }

  /**
   * generateVolumeSeries
   *
   * Creates an array of highcharts series containing an OHLC volume series using a collection of OHLC days.
   *
   * @param days
   * @return {[*]}
   */
  function generateVolumeSeries(days) {
    return [marketChartsService.createOHLCVolumeSeries(days)];
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
}

export default {
  name: 'ohlcController',
  fn: ohlcController
};
