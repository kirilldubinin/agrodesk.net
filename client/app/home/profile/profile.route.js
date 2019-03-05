(function() {
    'use strict';
    angular.module('agrodesk').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.profile', {
                url: '/profile',
                templateUrl: 'app/home/profile/profile.html',
                abstract: true
            }).state('tenant.profile.view', {
                url: '/view',
                templateUrl: 'app/home/profile/profileView/profileView.html',
                controller: 'ProfileViewController',
                controllerAs: 'profileView',
                data: {
                    module: 'profile'
                }
            }).state('tenant.profile.addUser', {
                url: '/addUser',
                templateUrl: 'app/home/profile/addUser/addUser.html',
                controller: 'AddUserController',
                controllerAs: 'addUser',
                data: {
                    module: 'profile'
                }
            }).state('tenant.profile.edit', {
                url: '/edit',
                templateUrl: 'app/home/profile/profileEdit/profileEdit.html',
                controller: 'ProfileEditController',
                controllerAs: 'profileEdit',
                data: {
                    module: 'profile'
                }
            })
    }
})();