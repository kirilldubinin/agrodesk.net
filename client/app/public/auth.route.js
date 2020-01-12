(function() {
    'use strict';
    angular.module('public').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('registration', {
                url: '/registration',
                templateUrl: 'app/public/registration/registration.html',
                controller: 'RegistrationController',
                controllerAs: 'registration'
            }).state('forget', {
                url: '/forget',
                templateUrl: 'app/public/forget.html'
            });
    }
})();