(function() {
    'use strict';
    angular.module('public').controller('LoginController', LoginController);
    /** @ngInject */
    function LoginController($http, $state, authFactory) {
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
                    vm.info = err.message;
                }
            );
        };
    }
})();