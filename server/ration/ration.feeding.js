var _ = require('lodash');
var dimension = require('./ration.dimension');
var color = require('./ration.color');
var lang = require('./ration.lang');


function byMixers (mixerSize, totalWeight, distributionRation) {
    return _.map(distributionRation, (distribution) => {
        const weight = Math.ceil((totalWeight * (distribution / 100))/10) * 10;
        const fullMuxers = Math.floor(weight/mixerSize);
        if (fullMuxers === 0) {
            return [weight]
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
}

function getCompositionByMixer(weight, ration, totalWeight) {
    const composition = ration.composition;

    return _.map(composition, (item) => {
        return {
            name: item.name,
            value: item.componentType === 'mk' ?
                Math.round((weight * item.value * ration.general.cowsNumber) / totalWeight * 10) / 10 :    
                Math.ceil((weight * (item.proportion / 100))/10) * 10
        };
    });
}

function byComposition (byMixers, ration, totalWeight) {
    return _.map(byMixers, (mixer) => {
        if (_.isArray(mixer)) {
            return _.map(mixer, (weight) => {
                return getCompositionByMixer(weight, ration, totalWeight);
            });
        } else {
            return getCompositionByMixer(mixer, ration, totalWeight)
        }
    });
}

function feeding (rations) {
    return _.map(rations, (ration) => {
        const weightPerCow = _.sumBy(ration.composition, (c) => {
            return c.componentType === 'mk' ? 0 : c.value;
        });
        const totalWeight = Math.ceil(
            weightPerCow * ration.general.cowsNumber / 10
        ) * 10;
        const mixerSize = ration.mixerSize;
        const distributionRation = ration.distributionRation;
        const mixers = byMixers(mixerSize, totalWeight, distributionRation);
        const compositions = byComposition(mixers, ration, totalWeight);
        return {
            rationName: ration.general.name,
            dryMaterialConsumption: ration.general.dryMaterialConsumption,
            cowsNumber: ration.general.cowsNumber,
            totalWeight: totalWeight,
            mixerSize: mixerSize,
            distributionRation: distributionRation,
            byMixers: mixers,
            byComposition: compositions
        }
    })
}

module.exports = feeding;