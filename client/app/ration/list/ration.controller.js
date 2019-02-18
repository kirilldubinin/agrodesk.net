(function() {
    'use strict';
    angular.module('ration').controller('RationController', RationController);

    function RationController($scope, $window, $state, rationFactory, $mdDialog) {
        var vm = this;
        
        rationFactory.getRations().then(function(result) {
            vm.rationItems = result.rations;
        });

        vm.onRationClick = function(rationItem) {
            vm.selectedItemId = rationItem._id;
            $state.go('tenant.ration.instance', { 'rationId': rationItem._id });
        };
    }
})();