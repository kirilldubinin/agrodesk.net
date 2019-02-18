var Ration = require('../models/ration');
var _ = require('lodash');

function sortRations (a,b) {
    return b.createdAt.getTime() - a.createdAt.getTime();
}

function list(rations) {
    var sortedRations = rations.sort(sortRations);
    var shortRations = _.map(sortedRations, function(ration) {
        return _.merge({}, ration.general, {_id: ration._id});
    });

    var filterValues = {
        type: _.filter(_.uniq(_.map(shortRations, 'type')), null).sort(function (a,b) { return b - a; }),
        name: _.filter(_.uniq(_.map(shortRations, 'name')), null).sort(function (a,b) { return b - a; })
    };
    return {
        rations: shortRations,
        filterValues: filterValues
    };
}

module.exports = list;