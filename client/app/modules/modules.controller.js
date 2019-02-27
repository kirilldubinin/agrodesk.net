(function() {
    'use strict';
    angular.module('help').controller('ModulesController', ModulesController);
    /** @ngInject */
    function ModulesController($scope) {
        var vm = this;
        vm.select = function () {
            alert('select');
        }
    }
})();