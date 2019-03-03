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
            console.log(vm.sessionData);
            rationFactory.getRationView(rationId).then(function(rationView) {
                vm.general = rationView.general;
                vm.composition = rationView.composition;
                vm.actions = rationView.actions;
            });
        });

        vm.delete = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Удаление')
                .textContent('Вы хотите удалить рацион "' + vm.general.controls.name.value + '" ?')
                .targetEvent(ev).ok('Да').cancel('Отменить');
            $mdDialog.show(confirm).then(function() {
                rationFactory.deleteRation(rationId).then(function(res) {
                    $state.go('tenant.ration');
                });
            }, function() {});
        };

        vm.edit = function() {
            $state.go('tenant.ration.edit', {
                'rationId': rationId
            });
        };
    }
})();