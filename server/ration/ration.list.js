var lang = require('./ration.lang');
var _ = require('lodash');

function sortRations (a,b) {
    return b.createdAt.getTime() - a.createdAt.getTime();
}

function list(rations) {
    var sortedRations = rations.sort(sortRations);
    var shortRations = _.map(sortedRations, function(ration) {
        return {
            _id: ration._id,
            number: ration.general.number,
            rationTypeName: lang(ration.general.rationType),
            rationType: ration.general.rationType,
            estimatedProductivity: ration.general.estimatedProductivity,
            name: ration.general.name,
            dryMaterialConsumption: ration.general.dryMaterialConsumption,
            rationPrice: ration.general.rationPrice,
            ratio: ration.general.ratio,
            startDate: ration.general.startDate,
            endDate: ration.general.endDate
        }
    });

    // in progress
    var inProgress = shortRations.filter((r) => { return  !r.endDate });
    const inProgressMilk = inProgress.filter((r) => { return  r.rationType === 'milk' });
    const inProgressDry = inProgress.filter((r) => { return  r.rationType === 'dry' });
    const inProgressYoung = inProgress.filter((r) => { return  r.rationType === 'young' });
    const inProgressFattening = inProgress.filter((r) => { return  r.rationType === 'fattening' });

    inProgress = _.concat(inProgressMilk, inProgressDry, inProgressYoung, inProgressFattening);

    var done = shortRations.filter((r) => { return  r.endDate });
    const doneMilk = done.filter((r) => { return  r.rationType === 'milk' });
    const doneDry = done.filter((r) => { return  r.rationType === 'dry' });
    const doneYoung = done.filter((r) => { return  r.rationType === 'young' });
    const doneFattening = done.filter((r) => { return  r.rationType === 'fattening' });

    done = _.concat(doneMilk, doneDry, doneYoung, doneFattening);

    var filterValues = {
        type: _.filter(_.uniq(_.map(shortRations, 'type')), null).sort(function (a,b) { return b - a; }),
        name: _.filter(_.uniq(_.map(shortRations, 'name')), null).sort(function (a,b) { return b - a; })
    };
    return {
        rations: _.concat(inProgress, done),
        filterValues: filterValues
    };
}

module.exports = list;