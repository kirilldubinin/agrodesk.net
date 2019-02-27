(function() {
    // modules
    'use strict';
    angular.module('ration')
    	.constant('RATION_TYPES',[
            {
                value: 'milk',
                name: 'дойный'
            },
            {
                value: 'dry',
                name: 'сухостой'
            },
            {
                value: 'young',
                name: 'молодняк'
            },
            {
                value: 'fattening',
                name: 'откорм'
            }
        ]);
    angular.module('ration')
    	.constant('RATION_COMPONENT_TYPES',[
            {
                value: 'ok',
                name: 'OK'
            },
            {
                value: 'kk',
                name: 'KK'
            },
            {
                value: 'mk',
                name: 'MK'
            }
        ]);
})();