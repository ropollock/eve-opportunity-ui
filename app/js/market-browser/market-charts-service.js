function marketChartsService($timeout, $log, numbers) {
  'ngInject';

  const service = {};

  service.createDefaultOHLCConfig = createDefaultOHLCConfig;
  service.createOHLCInterval = createOHLCInterval;
  service.createOHLCSeries = createOHLCSeries;
  service.createOHLCVolumeSeries = createOHLCVolumeSeries;
  service.calcMovingAvg = calcMovingAvg;
  service.daysToAverages = daysToAverages;
  service.create5DaySMASeries = create5DaySMASeries;
  service.createDefaultPriceHistoryConfig = createDefaultPriceHistoryConfig;
  service.createAverageSeries = createAverageSeries;
  service.create20DaySMASeries = create20DaySMASeries;
  service.createUpperMovingBollingerBandSeries = createUpperMovingBollingerBandSeries;
  service.createLowerMovingBollingerBandSeries = createLowerMovingBollingerBandSeries;
  service.createUpperBollingerBandSeries = createUpperBollingerBandSeries;
  service.createLowerBollingerBandSeries = createLowerBollingerBandSeries;

  return service;

  function createDefaultOHLCConfig() {
    return {
      series: [],
      title: {
        text: 'OHLC'
      },
      options : {
        chart: {
          zoomType: 'x'
        },
        rangeSelector: {
          enabled: true
        },
        navigator: {
          enabled: true
        },
        scrollbar: {
          enabled: false
        },
        yAxis: [{
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'ISK'
          },
          height: '60%',
          lineWidth: 2
        }, {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }]
      },
      useHighStocks: true,
      func: function(chart) {
        // This is a workaround for a bug in ng highcharts
        $timeout(function() {
          chart.reflow();
        }, 0);
      }
    }
  }

  function createDefaultPriceHistoryConfig() {
    return {
      series: [],
      options: {
        chart: {
          zoomType: 'x',
          toggleModify : false
        },
        rangeSelector: {
          enabled: true
        },
        navigator: {
          enabled: true
        },
        scrollbar: {
          enabled: false
        },
        yAxis: {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'ISK'
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ISK<br/>',
          valueDecimals: 2,
          split: true
        }
      },
      useHighStocks: true,
      func: function(chart) {
        // This is a workaround for a bug in ng highcharts
        $timeout(function() {
          chart.reflow();
        }, 0);
      }
    };
  }

  function createOHLCSeries(days) {
    return {
      type: 'candlestick',
      name: 'OHLC',
      tooltip: {
        valueDecimals: 1,
        valueSuffix: ' ISK',
      },
      data: days.map((day) => {
        return createOHLCInterval({
          open: day.open,
          close: day.close,
          high: day.max,
          low: day.min,
          time: day.time
        })
      }),
      dataGrouping: {
        units: [['day', 1]]
      }
    }
  }

  function createOHLCInterval(interval) {
    let {time, high, low, open, close} = interval;
    return [time, open, high, low, close];
  }

  function createOHLCVolumeSeries(days) {
    return {
      type: 'column',
      name: 'Average Volume',
      yAxis: 1,
      tooltip: {
        valueDecimals: 1
      },
      dataGrouping: {
        units: [
          ['day', 1]
        ]
      },
      data: days.map((day) => {
        return [day.time, day.avgVolume];
      })
    };
  }

  function create5DaySMASeries(days) {
    return createLineSeries(calcMovingAvg(daysToAverages(days), 5), '5 day moving average');
  }

  function create20DaySMASeries(days) {
    return createLineSeries(calcMovingAvg(daysToAverages(days), 20), '20 day moving average');
  }

  function createAverageSeries(days) {
    return createLineSeries(daysToAverages(days), 'average');
  }

  function createUpperBollingerBandSeries(days) {
    return createDashedLineSeries(daysToUpperStdDev(days), 'upper variance');
  }

  function createLowerBollingerBandSeries(days) {
    return createDashedLineSeries(daysToLowerStdDev(days), 'lower variance');
  }

  function createUpperMovingBollingerBandSeries(days, interval, bandMagnitude = 2) {
    let sma = calcMovingAvg(daysToAverages(days), interval);
    let stdDevInterval = calcMovingStdDev(daysToAverages(days), interval);
    let upperBand = calcUpperBollingerBand(sma, stdDevInterval, bandMagnitude);

    return createDashedLineSeries(upperBand, interval + ' day upper variance');
  }

  function createLowerMovingBollingerBandSeries(days, interval, bandMagnitude = 2) {
    let sma = calcMovingAvg(daysToAverages(days), interval);
    let stdDevInterval = calcMovingStdDev(daysToAverages(days), interval);
    let lowerBand = calcLowerBollingerBand(sma, stdDevInterval, bandMagnitude);

    return createDashedLineSeries(lowerBand, interval +' day lower variance');
  }

  function createLineSeries(data = [], name = '') {
    return {
      name: name,
      data: data,
      tooltip: {
        valueDecimals: 1
      }
    };
  }

  function createDashedLineSeries(data = [], name = '') {
    return {
      name: name,
      dashStyle: 'longdash',
      data: data,
      tooltip: {
        valueDecimals: 1
      }
    }
  }

  function calcUpperBollingerBand(sma, stdDevInterval, magnitude) {
    return sma.map((day, index) => {
      return {x: day.x, y: day.y + (stdDevInterval[index].y * magnitude)};
    });
  }

  function calcLowerBollingerBand(sma, stdDevInterval, magnitude) {
    return sma.map((day, index) => {
      return {x: day.x, y: day.y - (stdDevInterval[index].y * magnitude)};
    });
  }

  function daysToUpperStdDev(days) {
    return days.map(function(day) {
      return {x: day.time, y: day.stdDevBounds.upper};
    });
  }

  function daysToLowerStdDev(days) {
    return days.map(function(day) {
      return {x: day.time, y: day.stdDevBounds.lower};
    });
  }

  function daysToAverages(days) {
    return days.map(function(day) {
      return {x: day.time, y: day.avg};
    });
  }

  function calcMovingAvg(points, n) {
    return points.map(function (each, index, arr) {
      const fromIndex = index - n;
      let subSeq, sum;

      if(fromIndex >= 0) {
        // Splice the period from the array.
        subSeq = arr.slice(fromIndex, index);

        // Get sum
        sum = subSeq.reduce(function(a, b) {
          return a + b.y;
        }, 0);

        // Get average
        return {x: each.x, y: sum / n};
      }
      else {
        // Insufficient data to calculate average, return undefined for that interval.
        return {x: each.x, y: undefined};
      }
    });
  }

  function calcMovingStdDev(points, n) {
    return points.map((each, index, arr) => {
      const fromIndex = index -n;

      if(fromIndex >= 0) {
        // Splice the period from the array.
        let subSeq = arr.slice(fromIndex, index).map((point) => {
          return point.y;
        });

        // Get standard deviation
        const stdDev = numbers.statistic.standardDev(subSeq);

        // Return point standard deviation
        return {x: each.x, y: stdDev};
      }
      else {
        // Insufficient data to calculate standard deviation for that interval.
        return {x: each.x, y: undefined};
      }
    })
  }
}

export default {
  name: 'marketChartsService',
  fn: marketChartsService
}
