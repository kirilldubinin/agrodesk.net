(function() {
    'use strict';
    angular.module('ration').controller('RationEditController', RationEditController);

    function RationEditController($scope, $stateParams, RATION_TYPES, RATION_COMPONENT_TYPES, rationFactory, authFactory, _, $state) {
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

        authFactory.getSessionData().then(function(data) {
            vm.sa = data.user.permissions.indexOf('sa') > -1;
            console.log(vm.sa);
        });

        function _sort (a, b) {
            return b.value - a.value;
        }

        vm.sort = function () {
            var ok = _.filter(vm.rationComposition.initialItem, {componentType: 'ok'});
            var kk = _.filter(vm.rationComposition.initialItem, {componentType: 'kk'});
            var mk = _.filter(vm.rationComposition.initialItem, {componentType: 'mk'});

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
                delete newComponent._id;
            } 
            
            newComponent.componentType = newComponent.componentType || last.componentType;
            vm.rationComposition.initialItem.push(newComponent);
            vm.update();
        };

        vm.update = function () {

            vm.error = '';

            // validate
            // proportion
            var proportionInvalid = 0;
            var dryMaterialInvalid = false;
            _.map(vm.rationComposition.initialItem, function (component) {
                component.componentType !== 'mk' && (proportionInvalid += component.proportion);
                dryMaterialInvalid = dryMaterialInvalid || (component.dryMaterial > 1);
            });

            if (proportionInvalid > 100) {
                vm.error = 'Сумма долей всех компонентов не может быть больше 100% !';
            } else if (dryMaterialInvalid) {
                vm.error = 'СВ в комопненте не может больше единицы !';
            }

            var fullPrice = 0;
            var OK = 0;
            var KK = 0;
            var rawMat = 0;
            var dryMat = 0;
            _.forEach(vm.rationComposition.initialItem, function (component) {
                // values
                if (component.componentType !== 'mk') {
                    component.value = 
                    Math.round(
                        (component.proportion * vm.rationGeneral.initialItem.dryMaterialConsumption) / 
                        (100 * component.dryMaterial)
                    * 10) / 10;
                }
                // price
                fullPrice += (component.price * component.value) || 0;

                // ratio
                if (component.componentType === 'ok') {
                    OK += component.proportion || 0;
                }

                // dry material in TMR
                rawMat += component.value;
                dryMat += component.value * component.dryMaterial;
            });

            if (_.isNumber(fullPrice) && !_.isNaN(fullPrice)) {
                vm.rationGeneral.initialItem.rationPrice = Math.round(fullPrice * 10) / 10;
            }
            
            if (_.isNumber(OK) && OK !== 0) {
                OK = Math.round(OK * 10) / 10;
                var KK = 100 - OK;
                KK = Math.round(KK * 10) / 10;
                vm.rationGeneral.initialItem.ratio = OK + ' / ' + KK;
            } else {
                vm.rationGeneral.initialItem.ratio = '0';
            }

            vm.rationGeneral.initialItem.dryMaterialTMR = Math.round((100-((rawMat-dryMat)/rawMat * 100)) * 10) / 10;

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