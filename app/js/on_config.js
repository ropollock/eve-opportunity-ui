function OnConfig($stateProvider, $locationProvider, $urlRouterProvider, $compileProvider) {
  'ngInject';

  if (process.env.NODE_ENV === 'production') {
    $compileProvider.debugInfoEnabled(false);
  }

  $locationProvider.html5Mode(true);

  $stateProvider
  .state('market-browser', {
    url: '/',
    templateUrl: 'market-browser/market-browser-tpl.html',
    controller: 'marketBrowserController as marketBrowserCtrl',
    title: 'Market Browser'
  });

  $urlRouterProvider.otherwise('/');
}

export default OnConfig;
