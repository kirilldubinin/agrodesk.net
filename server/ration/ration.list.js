var lang = require('./ration.lang');
var _ = require('lodash');

function sortRations (a,b) {
    return +a.number - (+b.number);
}

function list(rations) {
    var shortRations = _.map(rations, function(ration) {
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
    const inProgressMilk = inProgress.filter((r) => { return  r.rationType === 'milk' }).sort(sortRations);
    const inProgressDry = inProgress.filter((r) => { return  r.rationType === 'dry' }).sort(sortRations);
    const inProgressYoung = inProgress.filter((r) => { return  r.rationType === 'young' }).sort(sortRations);
    const inProgressFattening = inProgress.filter((r) => { return  r.rationType === 'fattening' }).sort(sortRations);

    inProgress = _.concat(inProgressMilk, inProgressDry, inProgressYoung, inProgressFattening);

    var done = shortRations.filter((r) => { return  r.endDate }).sort(sortRations);
    const doneMilk = done.filter((r) => { return  r.rationType === 'milk' }).sort(sortRations);
    const doneDry = done.filter((r) => { return  r.rationType === 'dry' }).sort(sortRations);
    const doneYoung = done.filter((r) => { return  r.rationType === 'young' }).sort(sortRations);
    const doneFattening = done.filter((r) => { return  r.rationType === 'fattening' }).sort(sortRations);

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