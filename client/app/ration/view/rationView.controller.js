(function() {
    'use strict';
    //RationViewController.$inject = ['$mdDialog', '$stateParams', '$state', 'authFactory', 'rationFactory', '_']
    angular.module('ration').controller('RationViewController', RationViewController);

    function RationViewController($mdDialog, $stateParams, $state, authFactory, rationFactory, _) {
        var vm = this;
        var rationId = $stateParams.rationId;
        if (!rationId) {
            return;
        }

        authFactory.getSessionData().then(function(data) {
            vm.sessionData = data;
        });

        rationFactory.getRationView(rationId).then(function(rationView) {
            vm.general = rationView.general;
            vm.composition = rationView.composition;
            vm.actions = rationView.actions;
        });

        vm.edit = function() {
            $state.go('tenant.ration.edit', {
                'rationId': rationId
            });
        };
    }
})();