(function() {
    'use strict';
    RationEditController.$inject = ['$stateParams', 'RATION_TYPES', 'RATION_COMPONENT_TYPES', 'rationFactory', '_', '$state']
    angular.module('ration').controller('RationEditController', RationEditController);

    function RationEditController($stateParams, RATION_TYPES, RATION_COMPONENT_TYPES, rationFactory, _, $state) {
        var vm = this;


        vm.rationTypes = RATION_TYPES;
        vm.feedTypes = RATION_COMPONENT_TYPES;

        var rationId = $stateParams.rationId;
        var promise = rationId ? rationFactory.getRationEdit(rationId) : rationFactory.getEmptyRation();
        promise.then(function(ration) {
            vm.rationGeneral = ration[0];
            vm.rationComposition = ration[1];
        });

        vm.addComponent = function () {
            var newNumber = +_.last(vm.rationComposition.initialItem).number + 1;
            if (newNumber < 10) {
                newNumber = '0' + newNumber;
            }
            var newComponent = _.defaults({
                number: newNumber
            }, _.last(vm.rationComposition.initialItem));
            console.log(newComponent);
            vm.rationComposition.initialItem.push(newComponent);
        };

        vm.update = function () {
            // price
            var fullPrice = 0;
            _.forEach(vm.rationComposition.initialItem, function (item) {
                fullPrice += (item.price * item.value);
            });
            if (_.isNumber(fullPrice) && !_.isNaN(fullPrice)) {
                vm.rationGeneral.initialItem.price = Math.round(fullPrice * 100) / 100;
            }

            // ratio
            var OK = 0;
            var KK = 0;
            _.forEach(vm.rationComposition.initialItem, function (item) {
                if (item.componentType === 'ok') {
                    OK += item.value;
                } else if (item.componentType === 'kk') {
                    KK += item.value;
                }
            });
            if (_.isNumber(OK) && OK !== 0 && _.isNumber(KK) && KK !== 0) {
                vm.rationGeneral.initialItem.ratio = Math.round(OK/KK * 100) / 100;
            }
        };

        vm.perGroupInMonth = function (value) {
            if (_.isNumber(value) && _.isNumber(vm.rationGeneral.initialItem.cowsNumber)) {
                return value * 30 * vm.rationGeneral.initialItem.cowsNumber
            } 
            else return 0;
        };

        vm.cancel = function () {
            if (rationId) {
                $state.go('tenant.ration.instance', {
                    'rationId': rationId
                });    
            } else {
                $state.go('tenant.ration'); 
            }
        };
        vm.save = function () {
            var ration = {
                general: vm.rationGeneral.initialItem,
                composition: vm.rationComposition.initialItem
            };

            ration._id = rationId || null;
            

            rationFactory.saveRation(ration).then(function(response) {
                if (response.message === 'OK') {
                    $state.go('tenant.ration.instance', {
                        'rationId': response.id
                    });
                }
            });
        };
    }
})();