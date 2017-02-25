const testHelper = require('./test-helper');

describe('Unit: ohlcController', function() {
  let ohlcCtrl, scope;

  beforeEach(function() {
    angular.mock.module('app');
    angular.mock.inject(($controller, $rootScope) => {
      scope = $rootScope.$new();
      ohlcCtrl = $controller('ohlcController', {$scope: scope});
    });
  });

  it('should have a config in the view model', function() {
    expect(ohlcCtrl.config).toBeDefined();
    expect(ohlcCtrl.config).not.toBe(null);
  });

  it('generateSeries should have two series', function() {
    let series = ohlcCtrl.generateSeries(testHelper.getOHLCDays(30));
    expect(series.length).toEqual(2);
    let candlestickSeries = series.filter((s) => {
      return s.type === 'candlestick';
    });
    let volumeSeries = series.filter((s) => {
      return s.type === 'column';
    });
    expect(candlestickSeries.length).toEqual(1);
    expect(candlestickSeries[0].data.length).toEqual(30);
    expect(volumeSeries.length).toEqual(1);
    expect(volumeSeries[0].data.length).toEqual(30);
  });

  it('generateCandlestickSeries should have a candlestick series', function() {
    let series = ohlcCtrl.generateCandlestickSeries(testHelper.getOHLCDays(30));
    expect(series.length).toEqual(1);
    expect(series[0].type).toEqual('candlestick');
    expect(series[0].data.length).toEqual(30);
  });

  it('generateVolumeseries should have a column series', function() {
    let series = ohlcCtrl.generateVolumeSeries(testHelper.getOHLCDays(30));
    expect(series.length).toEqual(1);
    expect(series[0].type).toEqual('column');
    expect(series[0].data.length).toEqual(30);
  });

  it('clearSeries should set series to []', function() {
    let config = {series: ohlcCtrl.generateSeries(testHelper.getOHLCDays(30))};
    expect(config.series.length).toEqual(2);
    ohlcCtrl.clearSeries(config);
    expect(config.series.length).toEqual(0);
  });
});
