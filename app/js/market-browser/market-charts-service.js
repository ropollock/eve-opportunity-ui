function marketChartsService($timeout, numbers) {
  'ngInject';

  const service = {};

  service.createDefaultOHLCConfig = createDefaultOHLCConfig;
  service.dayToOHLCInterval = dayToOHLCInterval;
  service.dayToVolumeTuple = dayToVolumeTuple;
  service.createOHLCSeries = createOHLCSeries;
  service.createOHLCVolumeSeries = createOHLCVolumeSeries;
  service.calcMovingAvg = calcMovingAvg;
  service.calcAvg = calcAvg;
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
        text: 'Open High Low Close'
      },
      options : {
        credits: {
          enabled: false
        },
        chart: {
          toggleModify : false,
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
        credits: {
          enabled: false
        },
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
      data: days.map(dayToOHLCInterval),
      dataGrouping: {
        units: [['day', 1]]
      }
    }
  }

  function dayToOHLCInterval(day) {
    return [day.time, day.open, day.max, day.min, day.close];
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
      data: days.map(dayToVolumeTuple)
    };
  }

  function dayToVolumeTuple(day) {
    return [day.time, day.avgVolume];
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

  /**
   * calcMovingAvg
   *
   * Calculates an array of points where the y value is a simple moving average of n points.
   *
   * @param points
   * @param n
   * @return array
   */
  function calcMovingAvg(points, n) {
    return points.map(function (each, index, arr) {
      const fromIndex = index - n;

      // Check that there are sufficient points to calculate an average.
      if(fromIndex >= 0) {
        // Get the average by calculating the average of the spliced period.
        return {x: each.x, y: calcAvg(arr.slice(fromIndex, index))};
      }
      else {
        // Insufficient points to calculate an average, instead return undefined for that interval.
        return {x: each.x, y: undefined};
      }
    });
  }

  /**
   * calcAvg
   *
   * Calculates a simple average of a point's y value from an array of points.
   * @param points
   * @return {number}
   */
  function calcAvg(points) {
    return points.reduce((a, b) => {
      return a + b.y;
    }, 0) / points.length;
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
