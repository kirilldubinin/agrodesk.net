(function() {
    'use strict';
    angular.module('agrodesk').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.info', {
                url: '/info',
                templateUrl: 'app/home/info/info.html',
                controller: 'InfoController',
                controllerAs: 'info',
                data: {
                    module: 'info'
                }
            });
    }
})();