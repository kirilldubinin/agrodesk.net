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

    /*
    const serie = 'actualProductivity';
    var categories = [];
    var allRationsHistory = _.map(rations, (ration) => {
        
        var historyByRation = {}
        _.forEach(ration.history, (h) => {
            var data;
            if (serie === 'ratio') {
                const ratio = h['ratio'].split('/');
                data = Math.round(+ratio[0]/+ratio[1] * 100)/100;
            } else {
                data = h[serie];
            }

            const formatDate = formatter.formatDate(h.date)
            categories.push(formatDate);
            historyByRation[formatDate] = data;
        });
        return {
            name: ration.general.name,
            history: historyByRation
        };
    })

    categories = _.uniq(categories);
    categories.sort();
    var series = _.map(allRationsHistory, (h) => {
        return {
            name: h.name,
            data: _.map(categories, (c) => {
                return h.history[c] || null;
            })
        }
    })

    return {
        history: _.map(rations, (r) => {
            return {
                name: r.general.name,
                history: r.history
            }
        }),
        categories: categories,
        series: series
    };*/

    var allRations = _.map(rations, (ration) => {

        // uniq date
        ration.history = _.reverse(ration.history);
        ration.history = _.map(ration.history, (hist) => {
            hist.date = formatter.formatDate(hist.date)
            return hist;
        });
        ration.history = _.uniqBy(ration.history, 'date');
        ration.history = _.reverse(ration.history);

        var series = _.map(allSeries, (serie) => {
            var data;
            if (serie === 'ratio') {
                data = _.map(ration.history, (hist) => {
                    const ratio = hist['ratio'].split('/');
                    return Math.round(+ratio[0]/+ratio[1] * 100)/100
                });
            } else {
                data = _.map(ration.history, (hist) => {
                    return hist[serie]
                });
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

        var categories = _.map(ration.history, 'date');
        categories = _.uniq(categories);

        return {
            _id: ration._id,
            showChart: false,
            general: ration.general,
            categories: categories,
            series: series
        }
    })

    allRations = _.sortBy(allRations, 'general.number')
    return allRations;
}

module.exports = history;