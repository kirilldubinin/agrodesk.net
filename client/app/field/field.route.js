(function() {
    'use strict';
    angular.module('ration').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.field', {
                url: '/field',
                templateUrl: 'app/field/list/field.html',
                controller: 'FieldController',
                controllerAs: 'field',
                data: {
                    module: 'field'
                }
            }).state('tenant.field.instance', {
                url: '/:fieldId',
                templateUrl: 'app/field/view/fieldView.html',
                controller: 'FieldViewController',
                controllerAs: 'fieldView',
                params: {
                    fieldId: undefined
                },
                data: {
                    module: 'field'
                }
            });
    }
})();