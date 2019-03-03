(function() {
    'use strict';
    angular.module('agrodesk').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('eula', {
                url: '/eula',
                templateUrl: 'app/public/eula.html'
            })
            .state('conditions', {
                url: '/conditions',
                templateUrl: 'app/public/conditions.html'
            })
            .state('public', {
                url: '',
                templateUrl: 'app/public/public.html',
                controller: 'PublicController',
                controllerAs: 'public'
            })
            .state('tenant', {
                url: '/:id',
                templateUrl: 'app/home/home.html',
                controller: 'HomeController',
                controllerAs: 'home'
            });
        //$urlRouterProvider.otherwise('/');
    }
})();