var _ = require('lodash');
var lang = require('./ration.lang');
var rationUtils = require('./ration.utils');
var Ration = require('../models/ration');
var dimension = require('./ration.dimension');

function convertToControl(item, parentKey) {

    var editObj = {};
    _.each(item, function(value, key) {
        if (item.hasOwnProperty(key)) {
            editObj[key] = {

                isEnum: rationUtils.enumFields[parentKey + '.' + key],
                isNumber: _.isNumber(value),
                isBoolean: value === true || value === false,
                isDisabled: rationUtils.disabledFields[parentKey + '.' + key],
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

function convert(ration) {
    if (!ration) {
        ration = Ration.getEmptyRation();
    }

    // sort field
    var goldRation = Ration.getEmptyRation();

    return [
        {
            label: lang('general'),
            key: 'general',
            initialItem: ration.general,
            controls: Ration.sort(convertToControl(ration.general, 'general'), 'general')
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
            ],
            body: ration.composition
        }
    ];
}
module.exports = convert;