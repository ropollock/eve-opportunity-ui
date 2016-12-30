const testHelper = require('./test-helper');

describe('Unit: priceHistoryController', function() {
  let priceHistoryCtrl, scope;

  beforeEach(function() {
    angular.mock.module('app');
    angular.mock.inject(($controller, $rootScope) => {
      scope = $rootScope.$new();
      priceHistoryCtrl = $controller('priceHistoryController', {$scope: scope});
    });
  });

  it('should have a config in the view model', function() {
    expect(priceHistoryCtrl.config).toBeDefined();
  });

  it('should have a form in the view model', function() {
    expect(priceHistoryCtrl.form).toBeDefined();
    let {selectedType, types, loadType} = priceHistoryCtrl.form;
    expect(selectedType).toEqual(priceHistoryCtrl.PRICE_HISTORY_AVERAGE);
    expect(types.length).toEqual(3);
    expect(loadType).toBeDefined();
  });

  it('should have data in the view model', function() {
    expect(priceHistoryCtrl.data).toBeDefined();
    let {averageSeries, sma5DaySeries, sma20DaySeries} = priceHistoryCtrl.data;
    expect(averageSeries).toBeDefined();
    expect(averageSeries.length).toEqual(0);
    expect(sma5DaySeries).toBeDefined();
    expect(sma5DaySeries.length).toEqual(0);
    expect(sma20DaySeries).toBeDefined();
    expect(sma20DaySeries.length).toEqual(0);
  });

  it('generateSeries should populate data object', function() {
    expect(priceHistoryCtrl.data.averageSeries.length).toEqual(0);
    expect(priceHistoryCtrl.data.sma5DaySeries.length).toEqual(0);
    expect(priceHistoryCtrl.data.sma20DaySeries.length).toEqual(0);
    priceHistoryCtrl.generateSeries(priceHistoryCtrl.data, testHelper.getOHLCDays(30));
    expect(priceHistoryCtrl.data.averageSeries.length).toEqual(3);
    expect(priceHistoryCtrl.data.sma5DaySeries.length).toEqual(3);
    expect(priceHistoryCtrl.data.sma20DaySeries.length).toEqual(3);
  });

  it('generateAverageSeries should return 3 line series', function() {
    let series = priceHistoryCtrl.generateAverageSeries(testHelper.getOHLCDays(30));
    let averageSeries = series.filter((s) => {return s.name === 'average'});
    let upperVarianceSeries = series.filter((s) => {return s.name === 'upper variance'});
    let lowerVarianceSeries = series.filter((s) => {return s.name === 'lower variance'});
    expect(series.length).toEqual(3);
    expect(averageSeries.length).toEqual(1);
    expect(upperVarianceSeries.length).toEqual(1);
    expect(lowerVarianceSeries.length).toEqual(1);
  });

  it('generateSMA5DaySeries should return 3 line series', function() {
    let series = priceHistoryCtrl.generateSMA5DaySeries(testHelper.getOHLCDays(30));
    let sma5DaySeries = series.filter((s) => {return s.name === '5 day moving average'});
    let upperVarianceSeries = series.filter((s) => {return s.name === '5 day upper variance'});
    let lowerVarianceSeries = series.filter((s) => {return s.name === '5 day lower variance'});
    expect(series.length).toEqual(3);
    expect(sma5DaySeries.length).toEqual(1);
    expect(upperVarianceSeries.length).toEqual(1);
    expect(lowerVarianceSeries.length).toEqual(1);
  });

  it('generateSMA20DaySeries should return 3 line series', function() {
    let series = priceHistoryCtrl.generateSMA20DaySeries(testHelper.getOHLCDays(30));
    let sma20DaySeries = series.filter((s) => {return s.name === '20 day moving average'});
    let upperVarianceSeries = series.filter((s) => {return s.name === '20 day upper variance'});
    let lowerVarianceSeries = series.filter((s) => {return s.name === '20 day lower variance'});
    expect(series.length).toEqual(3);
    expect(sma20DaySeries.length).toEqual(1);
    expect(upperVarianceSeries.length).toEqual(1);
    expect(lowerVarianceSeries.length).toEqual(1);
  });

  it('getDefaultType should return average type', function() {
    expect(priceHistoryCtrl.getDefaultType()).toEqual(priceHistoryCtrl.PRICE_HISTORY_AVERAGE);
  });

  it('loadType should switch config series to corresponding type', function() {
    priceHistoryCtrl.generateSeries(priceHistoryCtrl.data, testHelper.getOHLCDays(30));
    priceHistoryCtrl.config.series = priceHistoryCtrl.data.averageSeries;
    expect(priceHistoryCtrl.data.averageSeries.length).toBeDefined();
    expect(priceHistoryCtrl.config.series).toEqual(priceHistoryCtrl.data.averageSeries);
    priceHistoryCtrl.loadType(priceHistoryCtrl.config, priceHistoryCtrl.data, priceHistoryCtrl.PRICE_HISTORY_SMA5);
    expect(priceHistoryCtrl.config.series).toEqual(priceHistoryCtrl.data.sma5DaySeries);
  });

  it('loadType should not switch config series to unrecognized type', function() {
    priceHistoryCtrl.generateSeries(priceHistoryCtrl.data, testHelper.getOHLCDays(30));
    priceHistoryCtrl.config.series = priceHistoryCtrl.data.averageSeries;
    expect(priceHistoryCtrl.data.averageSeries.length).toBeDefined();
    expect(priceHistoryCtrl.config.series).toEqual(priceHistoryCtrl.data.averageSeries);
    priceHistoryCtrl.loadType(priceHistoryCtrl.config, priceHistoryCtrl.data, "something incorrect");
    expect(priceHistoryCtrl.config.series).toEqual(priceHistoryCtrl.data.averageSeries);
  });

  it('clearSeries should set series to []', function() {
    let config = {series: priceHistoryCtrl.generateAverageSeries(testHelper.getOHLCDays(30))};
    expect(config.series.length).toEqual(3);
    priceHistoryCtrl.clearSeries(config);
    expect(config.series.length).toEqual(0);
  });

  it('clearSeriesData should reset the data object in the view model', function() {
    priceHistoryCtrl.generateSeries(priceHistoryCtrl.data, testHelper.getOHLCDays(30));
    let {data} = priceHistoryCtrl;
    expect(data.averageSeries.length).toEqual(3);
    expect(data.sma5DaySeries.length).toEqual(3);
    expect(data.sma20DaySeries.length).toEqual(3);
    priceHistoryCtrl.clearSeriesData(priceHistoryCtrl.data);
    expect(data.averageSeries.length).toEqual(0);
    expect(data.sma5DaySeries.length).toEqual(0);
    expect(data.sma20DaySeries.length).toEqual(0);
  });
});
