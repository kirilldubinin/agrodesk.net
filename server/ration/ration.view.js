var _ = require('lodash');
var Ration = require('../models/ration');
var lang = require('./ration.lang');
var dimension = require('./ration.dimension');

function convertValue(key, val) {
    if (key === 'ratio') {
        return getRatio(val);
    } else if (key === 'rationType') {
        return lang(val);
    }
    return val;
}

function convertToControl(item) {
	var viewObj = {};
    _.each(item, function(value, key) {
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

function getRatio(val) {
    // ok + kk = 100
    // ok/kk = val
    // ok = kk * val
    // kk * val + kk = 100
    // kk(val + 1) = 100
    var kk = Math.round(100 / (1+val));
    var ok = 100 - kk;

    return (ok + ' / ' + kk);
}

function convert(ration, sessionData) {

	return [
        {
            label: lang('general'),
            key: 'general',
            controls: Ration.sort(convertToControl(ration.general), 'general')
        },
        {
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
                    label: lang('kiloPerDay')
                }
            ],
            body: _.map(ration.composition, (item) => {
				return _.merge(item, {
                    valuePerMonth: (Math.round(ration.general.cowsNumber * 30 * item.value * 100)/100) || 0
				})
			})
        }
    ];
}

module.exports = convert;