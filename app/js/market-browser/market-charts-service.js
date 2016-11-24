function marketChartsService($timeout, $log) {
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
  service.createLowerStdDevSeries = createLowerStdDevSeries;
  service.createUpperStdDevSeries = createUpperStdDevSeries;

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
        $timeout(function() {
          chart.reflow();
        }, 0);
      }
    }
  }

  function createDefaultPriceHistoryConfig() {
    return {
      title: {
        text: 'Price History'
      },
      series: [],
      options: {
        rangeSelector: {
          selected: 4
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
    return {
      name: '5 day average',
      data: calcMovingAvg(daysToAverages(days), 5),
      tooltip: {
        valueDecimals: 1
      }
    };
  }

  function create20DaySMASeries(days) {
    return {
      name: '5 day average',
      data: calcMovingAvg(daysToAverages(days), 20),
      tooltip: {
        valueDecimals: 1
      }
    };
  }

  function createAverageSeries(days) {
    return {
      name: 'average',
      data: daysToAverages(days),
      tooltip: {
        valueDecimals: 1
      }
    };
  }

  function createUpperStdDevSeries(days) {
    return {
      name: 'upper standard deviation',
      dashStyle: 'longdash',
      data: daysToUpperStdDev(days),
      tooltip: {
        valueDecimals: 1
      }
    };
  }

  function createLowerStdDevSeries(days) {
    return {
      name: 'lower standard deviation',
      dashStyle: 'longdash',
      data: daysToLowerStdDev(days),
      tooltip: {
        valueDecimals: 1
      }
    };
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
        // Insufficient data to calculate average, return undefined for that day.
        return {x: each.x, y: undefined};
      }
    });
  }
}

export default {
  name: 'marketChartsService',
  fn: marketChartsService
}
