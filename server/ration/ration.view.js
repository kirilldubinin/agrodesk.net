var _ = require('lodash');
var Ration = require('../models/ration');
var lang = require('./ration.lang');
var lang = require('./ration.lang');
var rationUtils = require('./ration.utils');
var dimension = require('./ration.dimension');
var history = require('../ration/ration.history');

function convertValue(key, val) {
    if (key === 'rationType') {
        return lang(val);
    } else if (_.isDate(val)) {
        return ('0' + val.getDate()).slice(-2) + '/' + ('0' + (val.getMonth() + 1)).slice(-2) + '/' + val.getFullYear();
    } 
    return val;
}

function convertToControl(item) {
	var viewObj = {};
    _.each(item, function(value, key) {

        // check field by rationType
        if (item.rationType !== 'milk' && rationUtils.milkOnlyFields[key]) {
            return;
        }

        // check if field should hide on view mode
        if (rationUtils.hideOnViewFields[key]) {
            return;
        }

        // check if value not empty
        if (_.isBoolean(value) || _.isNumber(value) || value) {
            viewObj[key] = {
                label: lang(key),
                value: convertValue(key, value),
                dimension: dimension(key),
                key: key
            }
        }
    });
    return viewObj;
}

/*function getRatio(val) {
    // ok + kk = 100
    // ok/kk = val
    // ok = kk * val
    // kk * val + kk = 100
    // kk(val + 1) = 100
    var kk = Math.round(100 / (1+val));
    var ok = 100 - kk;

    return (ok + ' / ' + kk);
}*/

function convert(ration, sessionData) {

    var actions = ['print'];
    if (sessionData) {
        var perms = sessionData.permissions;
        if (_.indexOf(perms, 'admin') !== -1 || _.indexOf(perms, 'write') !== -1) {
            actions.push('edit');
        }
        if (_.indexOf(perms, 'sa') !== -1) {
            actions.push('copy');
            actions.push('delete');
        }
    }

    var actionsIcon = {
        print: 'local_print_shop',
        copy: 'content_copy',
        edit: 'edit',
        delete: 'delete_forever'
    };

    var allControls = Ration.sort(convertToControl(ration.general), 'general');
    var controls = {
        left: _.pick(allControls, _.keys(rationUtils.viewLeftFields)),
        right: _.pick(allControls, _.keys(rationUtils.viewRightFields))
    };

    ration.composition = _.map(ration.composition, (item) => {
        item.priceInRation = Math.round(item.price * item.value * 100)/ 100
        return item;
    });
    let totalWeight = _.sumBy(ration.composition, item => {
        return item.componentType === 'mk' ? Math.round(item.value * ration.general.cowsNumber * 10) / 10 : Math.round(item.value * ration.general.cowsNumber)
    })
    const mixerSize = ration.distribution.mixerSize;
    const distributionRatio = ration.distribution.ratio;

    const byMixers = _.map(distributionRatio, (distribution) => {
        var weight =  Math.round(totalWeight * (distribution / 100) * 10) / 10;
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

    const byComposition = _.map(byMixers, (mixer) => {
        return _.map(mixer, function(weight) {
            let total = 0;
            return _.map(ration.composition, function(item) {
                let v = (weight * item.value * ration.general.cowsNumber) / totalWeight; 
                v = item.componentType === 'mk' ? Math.round(v * 10) / 10 : Math.round(v)
                total = item.componentType === 'mk' ? Math.round((total + v ) * 10) / 10 : Math.round(total + v) 
                return [v, total] ;
            });
        });
    })

	return {
        actions: _.map(actions, function (action) {
            return {
                key: action,
                label: lang(action),
                icon: actionsIcon[action] || '',
                buttonType: action === 'delete' ? 
                    'warn' : 'raised'
            };
        }),
        general: {
            label: lang('general'),
            key: 'general',
            initialItem: {
                rationType: ration.general.rationType
            },
            controls: controls// Ration.sort(convertToControl(ration.general), 'general')
        },
        composition: {
            label: lang('composition'),
            key: 'composition',
            header: [
                {
                    label: '#'
                },
                {
                    label: lang('component')
                },
                {
                    label: lang('price')
                },
                {
                    label: lang('dryMaterial')
                },
                {
                    label: lang('weight')
                },
                {
                    label: lang('portion')
                }
            ],
            body: ration.composition,
            total: {
                price: Math.round(_.sumBy(ration.composition, 'priceInRation')),
                weight: Math.round(_.sumBy(ration.composition, 'value')),
                proportion: Math.round(_.sumBy(ration.composition, (p) => {
                    return p.componentType === 'mk' ? 0 : p.proportion;
                }))
            }
        },
        distribution: {
            label: lang('distribution'),
            key: 'distribution',
            ratio: ration.distribution.ratio,
            byMixers: byMixers,
            byComposition: byComposition
        },
        history: history.getHistoryForRation(ration)
    };
}

module.exports = convert;