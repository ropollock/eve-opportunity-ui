function marketChartsService($timeout) {
  'ngInject';

  const service = {};

  service.createDefaultOHLCConfig = createDefaultOHLCConfig;
  service.createOHLCInterval = createOHLCInterval;
  service.createOHLCSeries = createOHLCSeries;
  service.createOHLCVolumeSeries = createOHLCVolumeSeries;

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
}

export default {
  name: 'marketChartsService',
  fn: marketChartsService
}
