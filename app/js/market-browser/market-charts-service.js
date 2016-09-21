
function marketChartsService() {
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
      useHighStocks: true
    }
  }

  function createOHLCInterval(interval) {
    let {time, high, low, open, close} = interval;

    return {
      x: time,
      open: open,
      high: high,
      low: low,
      close: close
    };
  }
}

export default {
  name: 'marketChartsService',
  fn: marketChartsService
}
