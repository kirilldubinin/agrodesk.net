(function() {
    'use strict';
    RationEditController.$inject = ['$scope', '$stateParams', 'RATION_TYPES', 'RATION_COMPONENT_TYPES', 'rationFactory', '_', '$state']
    angular.module('ration').controller('RationEditController', RationEditController);

    function RationEditController($scope, $stateParams, RATION_TYPES, RATION_COMPONENT_TYPES, rationFactory, _, $state) {
        var vm = this;


        $scope.$on('ADD_FEED_TO_RATION', function (e, feedItem) {
            vm.addComponent({
                _id: feedItem._id,
                name: feedItem.name + ' (' + feedItem.year + ')',
                price: feedItem.price,
                dryMaterial: feedItem.dryMaterial,
                value: 1
            });
        });

        vm.rationTypes = RATION_TYPES;
        vm.feedTypes = RATION_COMPONENT_TYPES;

        var rationId = $stateParams.rationId;
        var promise = rationId ? rationFactory.getRationEdit(rationId) : rationFactory.getEmptyRation();
        promise.then(function(ration) {
            vm.rationGeneral = ration[0];
            vm.rationComposition = ration[1];

            vm.update();
        });

        function _sort (a, b) {
            return b.value - a.value;
        }

        vm.sort = function () {
            var ok = _.filter(vm.rationComposition.initialItem, {componentType: 'ok'}).sort(_sort);
            var kk = _.filter(vm.rationComposition.initialItem, {componentType: 'kk'}).sort(_sort);
            var mk = _.filter(vm.rationComposition.initialItem, {componentType: 'mk'}).sort(_sort);

            vm.rationComposition.initialItem = ok.concat(kk).concat(mk);
            vm.rationComposition.initialItem = _.map(vm.rationComposition.initialItem, function (item, index) {
                item.number = index + 1;
                if (item.number < 10) {
                    item.number = '0' + item.number;
                }    
                return item; 
            });
        };

        vm.removeComponent = function (component) {
            vm.rationComposition.initialItem = vm.rationComposition.initialItem.filter(function (item) {
               return item !== component; 
            });
            vm.update();
        };

        vm.addComponent = function (newComponent) {
            
            var last = _.last(vm.rationComposition.initialItem);
            if (!newComponent) {
                newComponent = last ? _.clone(last) : {
                    name: 'Новый компонент',
                    componentType: 'ok',
                    price: 1,
                    value: 1,
                    proportion: 20,
                    dryMaterial: 0.5
                };
            } 
            
            newComponent.componentType = newComponent.componentType || last.componentType;
            vm.rationComposition.initialItem.push(newComponent);
            vm.update();
        };

        vm.update = function () {

            // values
            vm.rationComposition.initialItem = _.map(vm.rationComposition.initialItem, function (component) {
                component.value = 
                Math.round(
                    (component.proportion * vm.rationGeneral.initialItem.dryMaterialConsumption) / 
                    (100 * component.dryMaterial)
                * 100) / 100;
                return component;
            })

            // price
            var fullPrice = 0;
            _.forEach(vm.rationComposition.initialItem, function (item) {
                fullPrice += (item.price * item.value);
            });
            if (_.isNumber(fullPrice) && !_.isNaN(fullPrice)) {
                vm.rationGeneral.initialItem.rationPrice = Math.round(fullPrice * 100) / 100;
            }

            // ratio
            var OK = 0;
            var KK = 0;
            _.forEach(vm.rationComposition.initialItem, function (item) {
                if (item.componentType === 'ok') {
                    OK += item.value * item.dryMaterial;
                } else if (item.componentType === 'kk') {
                    KK += item.value * item.dryMaterial;
                }
            });
            if (_.isNumber(OK) && OK !== 0 && _.isNumber(KK) && KK !== 0) {

                 // ok + kk = 100
                // ok/kk = val
                // ok = kk * val
                // kk * val + kk = 100
                // kk(val + 1) = 100
                var KK = Math.round(100 / (1+OK/KK));
                var OK = 100 - KK;
                vm.rationGeneral.initialItem.ratio = OK + ' / ' + KK;
            } else {
                vm.rationGeneral.initialItem.ratio = 0;
            }

            // efficiency
            if (vm.rationGeneral.initialItem.milkPrice && 
                vm.rationGeneral.initialItem.rationPrice && 
                vm.rationGeneral.initialItem.actualProductivity) {
                    vm.rationGeneral.initialItem.efficiency = 
                        Math.round(vm.rationGeneral.initialItem.milkPrice * vm.rationGeneral.initialItem.actualProductivity / vm.rationGeneral.initialItem.rationPrice * 100) / 100;
            }

            vm.sort();
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