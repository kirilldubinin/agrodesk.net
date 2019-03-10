var _ = require('lodash');
var Ration = require('../models/ration');
var lang = require('./ration.lang');
var lang = require('./ration.lang');
var rationUtils = require('./ration.utils');
var dimension = require('./ration.dimension');

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
        if (item.rationType === 'dry' && rationUtils.milkOnlyFields[key]) {
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

    var actions = ['print', 'copy'];
    if (sessionData) {
        var perms = sessionData.permissions;
        if (_.indexOf(perms, 'admin') !== -1 || _.indexOf(perms, 'write') !== -1) {
            actions.push('edit');
            actions.push('delete');    
        }
    }

    var actionsIcon = {
        print: 'local_print_shop',
        copy: 'content_copy',
        edit: 'edit',
        delete: 'delete_forever'
    };

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
            controls: Ration.sort(convertToControl(ration.general), 'general')
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
            body: ration.composition
        }
    };
}

module.exports = convert;