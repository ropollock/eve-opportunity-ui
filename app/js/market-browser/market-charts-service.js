
function marketChartsService($timeout) {
  'ngInject';

  const service = {};

  service.createDefaultOHLCConfig = createDefaultOHLCConfig;
  service.createOHLCInterval = createOHLCInterval;

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

  function createOHLCInterval(interval) {
    let {time, high, low, open, close} = interval;
    return [time, open, high, low, close];
  }
}

export default {
  name: 'marketChartsService',
  fn: marketChartsService
}
