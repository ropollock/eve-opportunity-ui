const testHelper = require('./test-helper');

describe('Unit: marketChartsService', function () {
  let marketChartsService, numbers;

  beforeEach(function() {
    angular.mock.module('app');
    angular.mock.inject(($injector) => {
      marketChartsService = $injector.get('marketChartsService');
      numbers = $injector.get('numbers');
    });
  });

  it('should have numbers library', function () {
    expect(numbers).toBeDefined();
  });

  it('createDefaultOHLCConfig should create a default OHLC config object.', function () {
    const config = marketChartsService.createDefaultOHLCConfig();
    expect(config).toBeDefined();
    expect(config.series).toEqual([]);
    expect(config.title.text).toEqual('Open High Low Close');
    expect(config.useHighStocks).toBe(true);
    expect(config.func).toBeDefined();
    const {credits, chart, rangeSelector, navigator, scrollbar, yAxis} = config.options;
    expect(credits.enabled).toBe(false);
    expect(chart.toggleModify).toBe(false);
    expect(chart.zoomType).toEqual('x');
    expect(rangeSelector.enabled).toBe(true);
    expect(navigator.enabled).toBe(true);
    expect(scrollbar.enabled).toBe(false);
    expect(yAxis.length).toEqual(2);
    yAxis.map(axis => {
      expect(axis.labels).toBeDefined();
      expect(axis.title).toBeDefined();
    });
  });

  it('createDefaultPriceHistoryConfig should create a default price history config object.', function () {
    const config = marketChartsService.createDefaultPriceHistoryConfig();
    expect(config).toBeDefined();
    expect(config.series).toEqual([]);
    expect(config.useHighStocks).toBe(true);
    expect(config.func).toBeDefined();
    const {credits, chart, rangeSelector, navigator, scrollbar, yAxis} = config.options;
    expect(credits.enabled).toBe(false);
    expect(chart.toggleModify).toBe(false);
    expect(chart.zoomType).toEqual('x');
    expect(rangeSelector.enabled).toBe(true);
    expect(navigator.enabled).toBe(true);
    expect(scrollbar.enabled).toBe(false);
    expect(yAxis).toBeDefined();
    expect(yAxis.labels).toBeDefined();
    expect(yAxis.title).toBeDefined();
  });

  it('dayToOHLCInterval formats an OHLC day into a highcharts OHLC array', function () {
    const day = testHelper.getOHLCDays(1)[0];
    const interval = marketChartsService.dayToOHLCInterval(day);
    expect(interval.length).toEqual(5);
    expect(interval[0]).toEqual(day.time);
    expect(interval[1]).toEqual(day.open);
    expect(interval[2]).toEqual(day.max);
    expect(interval[3]).toEqual(day.min);
    expect(interval[4]).toEqual(day.close);
  });

  it('dayToVolumeTuple formats an OHLC day into a highcharts column array', function () {
    const day = testHelper.getOHLCDays(1)[0];
    const volumeTuple = marketChartsService.dayToVolumeTuple(day);
    expect(volumeTuple.length).toEqual(2);
    expect(volumeTuple[0]).toEqual(day.time);
    expect(volumeTuple[1]).toEqual(day.avgVolume);
  });

  it('daysToUpperStd formats an OHLC day into a highcharts line array', function () {
    const day = testHelper.getOHLCDays(1);
    const upperStd = marketChartsService.daysToUpperStdDev(day);
    expect(upperStd.length).toEqual(1);
    expect(upperStd[0].x).toEqual(day[0].time);
    expect(upperStd[0].y).toEqual(day[0].stdDevBounds.upper);
  });

  it('daysToLowerStd formats an OHLC day into a highcharts line array', function () {
    const day = testHelper.getOHLCDays(1);
    const lowerStd = marketChartsService.daysToUpperStdDev(day);
    expect(lowerStd.length).toEqual(1);
    expect(lowerStd[0].x).toEqual(day[0].time);
    expect(lowerStd[0].y).toEqual(day[0].stdDevBounds.lower);
  });

  it('createOHLCSeries returns a default OHLC series config', function () {
    const days = testHelper.getOHLCDays(30);
    const ohlcSeries = marketChartsService.createOHLCSeries(days);
    const {type, name, tooltip, data, dataGrouping} = ohlcSeries;
    expect(type).toEqual('candlestick');
    expect(name).toEqual('OHLC');
    expect(tooltip.valueDecimals).toEqual(1);
    expect(tooltip.valueSuffix).toEqual(' ISK');
    expect(data.length).toEqual(30);
    expect(dataGrouping.units[0].length).toEqual(2);
  });

  it('createOHLCVolumeSeries returns a default OHLC volume series config', function () {
    const days = testHelper.getOHLCDays(30);
    const ohlcVolumeSeries = marketChartsService.createOHLCVolumeSeries(days);
    const {type, name, tooltip, data, dataGrouping, yAxis} = ohlcVolumeSeries;
    expect(yAxis).toEqual(1);
    expect(type).toEqual('column');
    expect(name).toEqual('Average Volume');
    expect(tooltip.valueDecimals).toEqual(1);
    expect(data.length).toEqual(30);
    expect(dataGrouping.units[0].length).toEqual(2);
  });

  it('should transform an array of days into an array of point averages', function () {
    const days = testHelper.getOHLCDays(30);
    const dayAverages = marketChartsService.daysToAverages(days);
    expect(dayAverages.length).toBe(30);
    dayAverages.map((each, index) => {
      expect(each.x).toEqual(days[index].time);
      expect(each.y).toEqual(days[index].avg);
    });
  });

  it('should calculate an average of an array of points', function () {
    const points = [{x:1, y:2}, {x:2, y:4}, {x:3, y:6}, {x:4, y:8}];
    const avg = marketChartsService.calcAvg(points);
    expect(avg).toEqual(5);
  });

  it('should calculate a 5 day moving average array from an array of day averages', function () {
    const dayAverages = marketChartsService.daysToAverages(testHelper.getOHLCDays(30));
    const interval = 5;
    const movingAverages = marketChartsService.calcMovingAvg(dayAverages, interval);
    expect(movingAverages.length).toEqual(30);
    const undefinedSeq = movingAverages.slice(0, 5);
    undefinedSeq.map((each) => {
      expect(each.y).toBe(undefined);
    });
    const definedSeq = movingAverages.slice(5);
    definedSeq.map((each, index) => {
      expect(each.y).toBeDefined();
      expect(each.y).toEqual(marketChartsService.calcAvg(dayAverages.slice(index, index + interval)));
    });
  });

});
