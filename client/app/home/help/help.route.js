(function() {
    'use strict';
    angular.module('agrodesk').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.help', {
                url: '/help',
                templateUrl: 'app/home/help/help.html',
                controller: 'HelpController',
                controllerAs: 'help',
                data: {
                    module: 'help'
                }
            });
    }
})();