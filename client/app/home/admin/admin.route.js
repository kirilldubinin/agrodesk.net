(function() {
    'use strict';
    angular.module('agrodesk').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.admin', {
                url: '/admin',
                templateUrl: 'app/home/admin/admin.html',
                controller: 'AdminController',
                controllerAs: 'admin',
                data: {
                    module: 'admin'
                }
            })
            .state('admin.tenant', {
                url: '/:tenant_id',
                templateUrl: 'app/home/admin/tenant.html',
                controller: 'TenantController',
                controllerAs: 'tenant',
                params: {
                    tenant_id: undefined
                },
                data: {
                    module: 'admin'
                }
            });
    }
})();