(function() {
    'use strict';
    RationViewController.$inject = ['$mdDialog', '$stateParams', '$state', 'authFactory', 'feedFactory', '_']
    angular.module('ration').controller('RationViewController', RationViewController);

    function RationViewController($mdDialog, $stateParams, $state, authFactory, feedFactory, _) {
        var vm = this;
        vm.components = [
            {
                index: '01',
                type: 'ok',
                name: 'Сенаж смесь трав тр.9 (033960)',
                rate: 6,
                dryMatrial: 0.604,
                totalDryMaterial: 3.624,
                priceKilo: 0.85,
                priceTotal: 5.10  
            },
            {
                index: '02',
                type: 'ok',
                name: 'Сенаж смесь трав тр.8 (033957)',
                rate: 16,
                dryMatrial: 0.355,
                totalDryMaterial: 5.680,
                priceKilo: 0.85,
                priceTotal: 13.60  
            },
            {
                index: '03',
                type: 'ok',
                name: 'Силос кук. тр.4 2017 (062393)',
                rate: 11,
                dryMatrial: 0.228,
                totalDryMaterial: 2.508,
                priceKilo: 1.92,
                priceTotal: 21.12  
            },
            {
                index: '04',
                type: 'ok',
                name: 'Силос кук. тр.3 2018 (062394)',
                rate: 10,
                dryMatrial: 0.307,
                totalDryMaterial: 3.070,
                priceKilo: 1.92,
                priceTotal: 19.20  
            },
            {
                index: '05',
                type: 'ok',
                name: 'Солома ячменная',
                rate: 0.5,
                dryMatrial: 0.430,
                totalDryMaterial: 0.860,
                priceKilo: 2.50,
                priceTotal: 1.25
            },
            {
                index: '06',
                type: 'kk',
                name: 'Кукуруза (зерно)',
                rate: 3.5,
                dryMatrial: 0.911,
                totalDryMaterial: 3.189,
                priceKilo: 7.70,
                priceTotal: 26.95
            },
            {
                index: '07',
                type: 'kk',
                name: 'Ячмень (зерно)',
                rate: 2.5,
                dryMatrial: 0.871,
                totalDryMaterial: 2.178,
                priceKilo: 5.30,
                priceTotal: 12.58
            },
            {
                index: '08',
                type: 'kk',
                name: 'Соевый шрот 49% (№18250)',
                rate: 2.0,
                dryMatrial: 0.881,
                totalDryMaterial: 1.762,
                priceKilo: 42.00,
                priceTotal: 84.00
            },
            {
                index: '09',
                type: 'kk',
                name: 'Шрот рапсовый 38% (№792)',
                rate: 1.7,
                dryMatrial: 0.897,
                totalDryMaterial: 1.525,
                priceKilo: 21.00,
                priceTotal: 35.70
            },
            {
                index: '10',
                type: 'kk',
                name: 'Пивная дробина свеж (Волга НН)',
                rate: 8.0,
                dryMatrial: 0.233,
                totalDryMaterial: 1.864,
                priceKilo: 1.10,
                priceTotal: 8.80
            },
            {
                index: '11',
                type: 'mk',
                name: 'Минерал - сода пищевая',
                rate: 0.200,
                dryMatrial: 0.990,
                totalDryMaterial: 0.198,
                priceKilo: 27.50,
                priceTotal: 5.50
            },
            {
                index: '12',
                type: 'mk',
                name: 'Минерал - соль поваренная',
                rate: 0.080,
                dryMatrial: 0.970,
                totalDryMaterial: 0.078,
                priceKilo: 5.00,
                priceTotal: 0.40
            },
            {
                index: '13',
                type: 'mk',
                name: 'Минерал - мел кормовой',
                rate: 0.200,
                dryMatrial: 0.980,
                totalDryMaterial: 0.196,
                priceKilo: 4.80,
                priceTotal: 0.96
            },
            {
                index: '14',
                type: 'mk',
                name: 'Премикс Камисан',
                rate: 0.200,
                dryMatrial: 0.950,
                totalDryMaterial: 0.190,
                priceKilo: 110.00,
                priceTotal: 22.00
            },
            {
                index: '15',
                type: 'mk',
                name: 'КД Кристалл Хефе',
                rate: 0.050,
                dryMatrial: 0.900,
                totalDryMaterial: 0.190,
                priceKilo: 170.0,
                priceTotal: 8.50
            }
        ]
    }
})();