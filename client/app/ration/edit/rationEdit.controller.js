(function() {
    'use strict';
    angular.module('ration').controller('RationEditController', RationEditController);

    function RationEditController($scope, $stateParams, RATION_TYPES, RATION_COMPONENT_TYPES, rationFactory, authFactory, _, $state, $timeout) {
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

        var updateTimeout;
        var rationId = $stateParams.rationId;
        var promise = rationId ? rationFactory.getRationEdit(rationId) : rationFactory.getEmptyRation();
        promise.then(function(ration) {
            vm.general = ration[0];
            vm.composition = ration[1];
            vm.distribution = ration[2];
            vm.update();
        });

        authFactory.getSessionData().then(function(data) {
            vm.sa = data.user.permissions.indexOf('sa') > -1;
        });

        vm.sort = function () {
            var ok = _.filter(vm.composition.initialItem, {componentType: 'ok'});
            var kk = _.filter(vm.composition.initialItem, {componentType: 'kk'});
            var mk = _.filter(vm.composition.initialItem, {componentType: 'mk'});

            vm.composition.initialItem = ok.concat(kk).concat(mk);
            vm.composition.initialItem = _.map(vm.composition.initialItem, function (item, index) {
                item.number = index + 1;
                if (item.number < 10) {
                    item.number = '0' + item.number;
                }    
                return item; 
            });
        };

        vm.removeComponent = function (component) {
            vm.composition.initialItem = vm.composition.initialItem.filter(function (item) {
               return item !== component; 
            });
            vm.update();
        };

        vm.addComponent = function (newComponent) {
            
            var last = _.last(vm.composition.initialItem);
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
            vm.composition.initialItem.push(newComponent);
            vm.update();
        };

        vm.update = function () {

            $timeout.cancel(updateTimeout)
            updateTimeout = $timeout(function() {
                vm.error = '';
                vm.distributionError = '';

                // update composition

                // validate
                // proportion
                var proportionInvalid = 0;
                var dryMaterialInvalid = false;
                _.map(vm.composition.initialItem, function (component) {
                    component.componentType !== 'mk' && (proportionInvalid += component.proportion);
                    dryMaterialInvalid = dryMaterialInvalid || (component.dryMaterial > 1);
                });

                if (proportionInvalid > 100) {
                    vm.error = 'Сумма долей всех компонентов не может быть больше 100% !';
                } else if (dryMaterialInvalid) {
                    vm.error = 'СВ в комопненте не может больше единицы !';
                }

                // estimatedProductivity
                if (vm.general.initialItem.productivityRate) {
                    vm.general.initialItem.estimatedProductivity = 
                        Math.round(vm.general.initialItem.productivityRate * vm.general.initialItem.dryMaterialConsumption * 10) / 10
                }

                var fullPrice = 0;
                var OK = 0;
                var KK = 0;
                var rawMat = 0;
                var dryMat = 0;
                _.forEach(vm.composition.initialItem, function (component) {
                    // values
                    if (component.componentType === 'ok') {
                        component.value = 
                        Math.round(
                            (component.proportion * vm.general.initialItem.dryMaterialConsumption) / 
                            (100 * component.dryMaterial)
                        * 10) / 10;
                    } else if (component.componentType === 'kk') {
                        component.value = 
                        Math.round(
                            (component.proportion * vm.general.initialItem.dryMaterialConsumption) / 
                            (100 * component.dryMaterial)
                        * 100) / 100;
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
                    vm.general.initialItem.rationPrice = Math.round(fullPrice * 10) / 10;
                }
                
                if (_.isNumber(OK) && OK !== 0) {
                    OK = Math.round(OK * 10) / 10;
                    var KK = 100 - OK;
                    KK = Math.round(KK * 10) / 10;
                    vm.general.initialItem.ratio = OK + ' / ' + KK;
                } else {
                    vm.general.initialItem.ratio = '0';
                }

                vm.general.initialItem.dryMaterialTMR = Math.round((100-((rawMat-dryMat)/rawMat * 100)) * 10) / 10;

                // efficiency
                if (vm.general.initialItem.milkPrice && 
                    vm.general.initialItem.rationPrice && 
                    vm.general.initialItem.actualProductivity) {
                        vm.general.initialItem.efficiency = 
                            Math.round(vm.general.initialItem.milkPrice * vm.general.initialItem.actualProductivity / vm.general.initialItem.rationPrice * 100) / 100;
                }

                vm.sort();

                // update distribution

                // validate
                var allRatio = 0;
                _.forEach(vm.distribution.initialItem.ratio, function (r) {
                    return allRatio += r;
                });

                if (allRatio > 100) {
                    vm.distributionError = 'Сумма процентов не может быть больше 100%';
                }

                // check mixer size, can not be < 1000
                //if (vm.distribution.initialItem.mixerSize < 1000) {
                    //vm.distribution.initialItem.mixerSize = 1000;
                //}

                var weightPerCow = 0;
                _.forEach(vm.composition.initialItem, function(c) {
                    weightPerCow += c.value;
                });
                vm.distribution.initialItem.totalWeight = Math.ceil(
                    weightPerCow * vm.general.initialItem.cowsNumber / 10
                ) * 10;
                
                vm.distribution.initialItem.byMixers = byMixers();
                vm.distribution.initialItem.byCompositions = byComposition();

            }, 500);
        };

        vm.removeDistributionItem = function (index) {
            vm.distribution.initialItem.ratio.splice(index, 1);
            vm.update();
        };

        vm.addDistrubutionItem = function () {
            vm.distribution.initialItem.ratio.push(0);
            vm.update();
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
                general: vm.general.initialItem,
                composition: vm.composition.initialItem,
                distribution: {
                    mixerSize: vm.distribution.initialItem.mixerSize,
                    ratio: vm.distribution.initialItem.ratio
                }
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

        function byMixers () {

            var mixerSize = vm.distribution.initialItem.mixerSize;
            var totalWeight = vm.distribution.initialItem.totalWeight;
            var distributionRatio = vm.distribution.initialItem.ratio;

            return _.map(distributionRatio, function(distribution) {
                var weight = Math.ceil((totalWeight * (distribution / 100)));
                var fullMuxers = Math.floor(weight/mixerSize);
                if (fullMuxers === 0) {
                    return [weight];
                } else {
                    var notFull = weight - (fullMuxers * mixerSize);
                    var result = [];
                    for (var i = 0; i < fullMuxers; i++) {
                        result.push(mixerSize);
                    }
                    result.push(notFull);
                    return result;
                }
            });
        }
        
        function byComposition () {
            var byMixers = vm.distribution.initialItem.byMixers;
            var totalWeight = vm.distribution.initialItem.totalWeight;
            return _.map(byMixers, function(mixer) {
                return _.map(mixer, function(weight) {
                    var map = _.map(vm.composition.initialItem, function(item) {
                        var v = (weight * item.value * vm.general.initialItem.cowsNumber) / totalWeight; 
                        return item.componentType === 'mk' ? Math.round(v * 10) / 10 : Math.round(v);
                    });
                    return map;
                });
            });
        }
    }
})();