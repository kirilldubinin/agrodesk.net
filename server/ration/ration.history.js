var _ = require('lodash');
var dimension = require('./ration.dimension');
var color = require('./ration.color');
var lang = require('./ration.lang');
var formatter = require('../formatter');


function history (rations) {

    const allSeries = ['dryMaterialConsumption', 'actualProductivity', 'estimatedProductivity', 'dryMaterialTMR', 'ratio', 
        'fat', 'protein', 'rationPrice', 'milkPrice', 'efficiency'];
    const defaultSeries = ['actualProductivity'];
    
    rations = _.filter(rations, (r) => { return r.general.rationType === 'milk' });
    return _.map(rations, (ration) => {

        var series = _.map(allSeries, (serie) => {
            var data;
            if (serie === 'ratio') {
                data = _.map(ration.history, (hist) => {
                    const ratio = hist['ratio'].split('/');
                    return Math.round(+ratio[0]/+ratio[1] * 100)/100;
                });
            } else {
                data = _.map(ration.history, serie);
            }

            return {
                color: color(serie),
                visible: defaultSeries.indexOf(serie) > -1,
                name: lang(serie) + (dimension(serie) && ', ' + dimension(serie)),
                data: data && data.length && data
            }
        });

        // filter, have to be any values in series
        series = _.filter(series, (serie) => {
            return serie.data && _.size(_.filter(serie.data, Boolean))
        });

        return {
            _id: ration._id,
            showChart: false,
            general: ration.general,
            categories: _.map(ration.history, (h) => {
                return formatter.formatDate(h.date);
            }),
            series: series
        }
    })
}

module.exports = history;