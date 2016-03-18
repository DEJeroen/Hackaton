var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      title: 'Artikel',
      templateUrl: 'partials/artikel.html',
      controller: 'artikelCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
    