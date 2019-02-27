(function() {
    'use strict';
    angular.module('ration').controller('RationController', RationController);

    function RationController($scope, $window, $state, rationFactory, feedFactory, $mdDialog) {
        var vm = this;
        
        rationFactory.getRations().then(function(result) {
            vm.rationItems = result.rations;
        });

        vm.onRationClick = function(rationItem) {
            vm.selectedItemId = rationItem._id;
            $state.go('tenant.ration.instance', { 'rationId': rationItem._id });
        };

        // actions
        vm.addRation = function() {
            $state.go('tenant.ration.new');
        };

        vm.onAddFeed = function (feedItem) {
            $scope.$broadcast('ADD_FEED_TO_RATION', feedItem);
        };

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            vm.editMode = (newState.name === 'tenant.ration.new' || newState.name === 'tenant.ration.edit');

            if (vm.editMode) {
                feedFactory.getFeedsForRation().then(function(result) {
                    vm.feedItems = result.feeds;
                });
            } 
            // get dashboard
            else {
                rationFactory.getRationDashboard().then(function (dashboard) {
                    vm.dashboard = dashboard;
                });
            }
        });
    }
})();