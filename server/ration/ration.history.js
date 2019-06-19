var _ = require('lodash');
var dimension = require('./ration.dimension');
var color = require('./ration.color');
var lang = require('./ration.lang');
var formatter = require('../formatter');

const defaultSeries = ['actualProductivity'];

function getHistoryForRation(ration) {
    const allSeries = ration.general.rationType === 'milk' ?
        ['dryMaterialConsumption', 'actualProductivity', 'estimatedProductivity', 'dryMaterialTMR', 'fat', 'protein', 'rationPrice', 'milkPrice', 'efficiency'] :
        ['dryMaterialConsumption', 'dryMaterialTMR', 'rationPrice'];
    
    // uniq date
    ration.history = _.reverse(ration.history);
    ration.history = _.map(ration.history, (hist) => {
        hist.date = formatter.formatDate(hist.date);
        return hist;
    });
    ration.history = _.uniqBy(ration.history, 'date');
    ration.history = _.reverse(ration.history);

    var series = _.map(allSeries, (serie) => {
        var data;
        if (serie === 'ratio') {
            data = _.map(ration.history, (hist) => {
                const ratio = hist.general['ratio'].split('/');
                return Math.round(+ratio[0]/+ratio[1] * 100)/100
            });
        } else {
            data = _.map(ration.history, (hist) => {
                return Math.round(hist.general[serie] * 10)/10
            });
        }

        return {
            color: color(serie),
            visible: defaultSeries.indexOf(serie) > -1,
            name: lang(serie) + (dimension(serie) && ', ' + dimension(serie)),
            data: data.length && data
        }
    });

    // filter, have to be any values in series
    series = _.filter(series, (serie) => {
        return serie.data && _.size(_.filter(serie.data, Boolean))
    });

    var categories = _.map(ration.history, 'date');
    categories = _.uniq(categories);

    return {
        categories: categories,
        series: series
    }
}

function getHistoryForRations(rations) {
    const allSeries = [
        'dryMaterialConsumption', 
        'actualProductivity', 
        'estimatedProductivity', 
        'dryMaterialTMR', 
        'fat', 
        'protein', 
        'rationPrice', 
        'milkPrice', 
        'efficiency',
        'ratio',
        'marginality'
    ];

    return _.map(allSeries, (serie) => {
        //const serie = 'actualProductivity';
        var categories = [];
        var allRationsHistory = _.map(rations, (ration) => {
            
            var historyByRation = {}
            _.forEach(ration.history, (h) => {
                var data;
                if (serie === 'ratio') {
                    const ratio = h.general['ratio'].split('/');
                    data = Math.round(+ratio[0]/+ratio[1] * 100)/100;
                } else if (serie === 'marginality') {
                    data = Math.round((h.general['milkPrice'] * h.general['actualProductivity'] - h.general['rationPrice']) * 10)/10 ;
                } else {
                    data = h.general[serie];
                }

                const formatDate = formatter.formatDate(h.date)
                categories.push(formatDate);
                historyByRation[formatDate] = data;
            });
            return {
                name: ration.general.name,
                history: historyByRation
            };
        });

        const reverseDateRepresentation = date => {
            let parts = date.split('/');
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        };
        categories = categories.map(reverseDateRepresentation).sort().map(reverseDateRepresentation);
        categories = _.uniq(categories);

        var series = _.map(allRationsHistory, (h) => {
            return {
                name: h.name,
                data: _.map(categories, (c) => {
                    return h.history[c] || null;
                })
            }
        })

        return {
            key: serie,
            label: lang(serie),
            dimension: dimension(serie),
            categories: categories,
            series: series
        };
    });
}

module.exports = {
    getHistoryForRation: getHistoryForRation,
    getHistoryForRations: getHistoryForRations
};