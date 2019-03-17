(function() {
    'use strict';
    angular.module('agrodesk').controller('InfoController', InfoController);
    /** @ngInject */
    function InfoController($scope, $state, version) {
    	var vm = this;
        vm.version = version;
    }
})();