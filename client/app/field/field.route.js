(function() {
    'use strict';
    angular.module('ration').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.field', {
                url: '/field',
                templateUrl: 'app/field/field.html',
                data: {
                    module: 'field'
                }
            });
    }
})();