var Feed = require('../models/feed');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension');
var _ = require('lodash');

function sortFeeds(a, b) {
    if (a.harvest.end && b.harvest) {
        return a.harvest.end.getTime() - b.harvest.end.getTime();
    } else {
        return a.general.year - b.general.year;
    }
}

function charts(feeds) {

    // filter feeds
    // feed with no totalWeight and analysis can't be include in chart
    feeds = _.filter(feeds, (feed) => {
        return _.size(feed.analysis) && feed.general.totalWeight;
    });
    var series = ['dryMaterial', 'ph', 'milkAcid', 'aceticAcid', 'oilAcid', 
                'exchangeEnergy', 'nel', 'crudeAsh', 'crudeProtein', 'crudeFat',
                'sugar', 'starch', 'crudeFiber', 'ndf', 'adf', 'adl'];

    //var byDefault = ['dryMaterial', 'ph', 'exchangeEnergy', 'crudeAsh', 'crudeProtein', 'crudeFiber'];*/
    var byDefault = ['crudeProtein'];
    try {
        var allYears = [];
        var chartSeries = _.map(series, function(seria) {
            var seriaDates = _(feeds)
            .map((feed) => {
                var lastAnalys = _.last(feed.analysis);
                var value = null;
                allYears.push(lastAnalys.date.getFullYear());
                if (_.isNumber(lastAnalys[seria])) {
                    if (feedUtils.propertyForRecalculate[seria]) {
                        value = lastAnalys.isNaturalWet ? 
                            
                            feedUtils.calcDryRaw(true, lastAnalys.dryMaterial, lastAnalys[seria]).dryValue : 
                            lastAnalys[seria];

                    } else {
                        value = lastAnalys[seria];
                    }
                    return {
                        year: feed.general.year,
                        value: value,
                        // dry weight
                        dryWeight: feed.general.totalWeight / lastAnalys.dryMaterial
                    };
                }
            })
            .reject(_.isUndefined)
            .groupBy('year')
            .map((data, key) => {
                /*
                    * C = (C1*V1 + ... Cn*Vn) / (V1 + ... Vn)
                    * c - concetration, v - volume/weight
                */

                var top = _.sumBy(data, (d) => {
                    return d.value * d.dryWeight;
                });
                var bottom = _.sumBy(data, 'dryWeight');
                var resultData = top/bottom;
                return {
                    year: key,
                    data: Math.round(resultData*100)/100
                }
            })
            .value();

            return {
                dimension: dimension(seria),
                name: lang(seria),
                visible: _.some(byDefault, function (d) { return d === seria; }),
                data: seriaDates.sort(function(a, b) {
                    return a.year - b.year;
                })
            }
        });

        allYears = _.uniq(allYears).sort(function(a, b) {
            return a - b;
        });

        chartSeries = _.map(chartSeries, function(chartSeria) {

            var groupByYear = _.groupBy(chartSeria.data, 'year');
            return {
                name: chartSeria.name + ', ' + chartSeria.dimension,
                data: _.map(allYears, function(year) {
                    if (!groupByYear[year]) {
                        return null;
                    } else {
                        return _.first(_.map(groupByYear[year], 'data'));
                    }
                }),
                visible: chartSeria.visible
            }
        });
    
        return {
            categories: allYears,
            chartSeries: chartSeries
        }
    } catch(e) {
        console.log(e);
    }  
    
}
module.exports = charts;