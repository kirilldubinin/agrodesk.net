(function() {
    'use strict';
    angular.module('public').controller('PublicController', PublicController);
    /** @ngInject */
    function PublicController($http, $state, authFactory) {
        var vm = this;

        vm.tenantName = $state.params.tenant;
        vm.user = {
            tenantname:  vm.tenantName || '',
            username: '',
            password: ''
        };
        vm.do = function () {
            authFactory.login(vm.user).then(
                function(response) {
                    $state.go('tenant', { 'id': response.tenantName });
                }, function (err) {
                    debugger;
                    vm.info = err.message;
                }
            );
        };
    }
})();