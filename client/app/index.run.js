(function() {
  'use strict';

  angular
    .module('agrodesk')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope) {
  	$rootScope._ = window._;
  }

})();
