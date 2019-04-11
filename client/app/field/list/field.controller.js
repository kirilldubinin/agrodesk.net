(function() {
    'use strict';
    angular.module('field').controller('FieldController', FieldController);

    function FieldController($scope, $state, rationFactory, feedFactory, authFactory) {
        var vm = this;

        vm.fields = [{
            id: 1,
            cadastral: '47:14:1203001:814',
            name: 'Поле #06 (участок 6)',
            analysis: 1,
            square: 40.6,
            currentSeed: {
                type: 'травосмесь',
                year: 2018
            }
        }]
    }
})();