var _ = require('lodash');
var lang = require('./ration.lang');
var rationUtils = require('./ration.utils');
var Ration = require('../models/ration');
var dimension = require('./ration.dimension');

function convertToControl(item, parentKey, user) {

    var editObj = {};
    var sa = _.indexOf(user.permissions, 'sa') !== -1; 
    _.each(item, function(value, key) {

        // check field by rationType
        if (item.rationType !== 'milk' && rationUtils.milkOnlyFields[key]) {
            return;
        }

        // check if field should hide on edit mode
        if (!sa && rationUtils.hideForNonSA[key]) {
            return;
        }

        if (item.hasOwnProperty(key)) {

            if (key === 'startDate') {
                console.log(rationUtils.disabledFields[parentKey + '.' + key])
                console.log(rationUtils.disabledFieldsForNonSA[parentKey + '.' + key])
                console.log(sa)
            }

            editObj[key] = {

                isEnum: rationUtils.enumFields[parentKey + '.' + key],
                isNumber: _.isNumber(value),
                isBoolean: value === true || value === false,
                isDisabled: rationUtils.disabledFields[parentKey + '.' + key] || 
                    (rationUtils.disabledFieldsForNonSA[parentKey + '.' + key] && !sa),
                isRequired: rationUtils.requiredFields[parentKey + '.' + key],
                isDate: rationUtils.dateFields[parentKey + '.' + key],

                label: lang(key),
                dimension: dimension(key),
                key: key,
                value: value
            }
        }
    });
    return editObj;
};

function convert(ration, user) {
    if (!ration) {
        ration = Ration.getEmptyRation();
    }

    var allControls = Ration.sort(convertToControl(ration.general, 'general', user), 'general');
    var controls = [
        _.pick(allControls, _.keys(rationUtils.editLeftFields)),
        _.pick(allControls, _.keys(rationUtils.editCenterFields)),
        _.pick(allControls, _.keys(rationUtils.editRightFields))
    ];

    return [
        {
            label: lang('general'),
            key: 'general',
            initialItem: ration.general,
            controls: controls// Ration.sort(convertToControl(ration.general, 'general', user), 'general')
        },
        {
            label: lang('composition'),
            key: 'composition',
            initialItem: ration.composition,
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
            ]
        }, {
            label: lang('distribution'),
            key: 'distribution',
            initialItem: ration.distribution,
        }
    ];
}
module.exports = convert;