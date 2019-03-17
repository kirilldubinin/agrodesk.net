(function() {
    'use strict';
    angular.module('public').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('registration', {
                url: '/registration',
                templateUrl: 'app/public/auth/registration/registration.html',
                controller: 'RegistrationController',
                controllerAs: 'registration'
            }).state('login', {
                url: '/login',
                templateUrl: 'app/public/auth/login/login.html',
                controller: 'LoginController',
                controllerAs: 'login'
            }).state('forget', {
                url: '/forget',
                templateUrl: 'app/public/auth/forget/forget.html',
                controller: 'ForgetController',
                controllerAs: 'forget'
            }).state('login.tenant', {
                url: '/:tenant',
                templateUrl: 'app/public/auth/login/login.html',
                controller: 'LoginController',
                controllerAs: 'login',
                params: {
                    tenant: undefined
                }
            });
    }
})();