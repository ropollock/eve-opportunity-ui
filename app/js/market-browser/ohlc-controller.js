function ohlcController($scope, $log, marketChartsService, _) {
  'ngInject'
  const vm = this;

  vm.config = marketChartsService.createDefaultOHLCConfig();

  activate();

  function activate() {
    watchForUpdatedDays();
  }

  function watchForUpdatedDays() {
    $scope.$watch(() => {return $scope.ohlc.days}, (days) => {
      if(days) {
        clearSeries(vm.config);
        vm.config.series = generateSeries(days);
        vm.config.options.chart.toggleModify = !vm.config.options.chart.toggleModify;
      }
    });
  }

  function generateSeries(days) {
    return _.concat(generateCandlestickSeries(days), generateVolumeSeries(days));
  }

  function generateCandlestickSeries(days) {
    return [marketChartsService.createOHLCSeries(days)];
  }

  function generateVolumeSeries(days) {
    return [marketChartsService.createOHLCVolumeSeries(days)];
  }

  function clearSeries(config) {
    config.series = [];
  }
}

export default {
  name: 'ohlcController',
  fn: ohlcController
};
