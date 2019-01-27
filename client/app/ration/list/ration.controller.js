(function() {
    'use strict';
    angular.module('ration').controller('RationController', RationController);

    function RationController($scope, $window, $state, rationFactory, $mdDialog) {
        var vm = this;
        
        vm.rationItems = [
            {
                uid: 201,
                type: 'раздой',
                target: 38,
                name: 'Высокопродуктивные 1 группа.',
                description: '',
                targetCow: {
                    group: 'Раздой 20-100',
                    weight: 600
                },
                price: 260.56,
                dryMaterial: 26.536,
                start: '22 Nov 2018',
                end: '',
                inProgress: true
            }
            /*{
                uid: 202,
                type: 'раздой',
                target: 32,
                name: '20-100 дней (соя)',
                description: '',
                targetCow: {
                    group: 'Раздой 20-100',
                    weight: 600
                },
                price: 150.80,
                dryMaterial: 21.6,
                start: '22 Nov 2018',
                end: '',
                inProgress: true
            },
            {
                uid: 215,
                type: 'сухостой',
                target: 12,
                name: '200-260 дней',
                description: '',
                targetCow: {
                    group: 'Сухостой 200-260 дней',
                    weight: 700
                },
                price: 94.80,
                dryMaterial: 11.2,
                start: '22 Nov 2018',
                end: '',
                inProgress: true
            },
            {
                uid: 187,
                type: 'сухостой',
                target: 14,
                name: '200-260 дней',
                description: '',
                targetCow: {
                    group: 'Сухостой 200-260 дней',
                    weight: 700
                },
                price: 94.80,
                dryMaterial: 11.2,
                start: '02 Oct 2018',
                end: '09 Oct 2018',
                inProgress: false
            }*/
        ]

        /*rationFactory.getRations().then(function(result) {
            vm.rationItems = result.rations;
        });*/

        vm.onRationClick = function(feedItem) {
            
        };
    }
})();