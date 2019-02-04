var _ = require('lodash');
var lang = require('./lang');
var dimension = require('./dimension');
var Feed = require('../models/feed');

function convert(feeds) {

    // filter
    // balance weight should exist
    feeds = _.filter(feeds, function (feed) {
        return _.isNumber(feed.general.totalWeight) && _.isNumber(feed.general.balanceWeight);
    });

    var silos = _.filter(feeds, (f)=> {
        return f.general.feedType === 'silage'
    });

    var byFeedType = _.map(feeds, 'general');
    byFeedType = _.groupBy(byFeedType, 'feedType');
    byFeedType = _.map(byFeedType, function (value, key) {
        var byCompos = _.map(_.groupBy(value, 'composition'), function (value, key){
            var total = _.sumBy(value, 'totalWeight');
            var balance = _.sumBy(value, 'balanceWeight');
            return {
                label: lang(key),
                total: total,
                balance: balance,
                balancePercent: Math.round((balance/total *100))                    
            }
        });

        var total = _.sumBy(value, 'totalWeight');
        var balance = _.sumBy(value, 'balanceWeight');
        return{
            label: lang(key),
            total: total,
            balance: balance,
            balancePercent: Math.round((balance/total *100)),
            byComposition: byCompos 
        };
    });

    var byComposition = _.map(feeds, 'general');
    byComposition = _.groupBy(byComposition, 'composition');
    byComposition = _.map(byComposition, function (value, key) {
        var byFeedType = _.map(_.groupBy(value, 'feedType'), function (value, key){
            
            var total = _.sumBy(value, 'totalWeight');
            var balance = _.sumBy(value, 'balanceWeight');
            return {
                label: lang(key),
                total: total,
                balance: balance,
                balancePercent: Math.round((balance/total *100))                    
            }
        });

        var total = _.sumBy(value, 'totalWeight');
        var balance = _.sumBy(value, 'balanceWeight');
        return{
            label: lang(key),
            total: total,
            balance: balance,
            balancePercent: Math.round((balance/total *100)),
            byFeedType: byFeedType 
        };
    });

    //chart
    var chartByFeedType = {
        chart: { type: 'bar' },
        title: { text: '' },
        xAxis: {
            categories: _.map(byFeedType, 'label')
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Осталось тонн'
            }
        },
        legend: { reversed: true },
        plotOptions: {
            series: { stacking: 'normal' }
        },
        series: _.map(byComposition, (composition) => {
            return {
                name: composition.label,
                data: _.map(byFeedType, (feedType) => {
                    var d = _.filter(feedType.byComposition, (c) => {
                        return c.label === composition.label;
                    })
                    return _.size(d) ? d[0].balance : 0;
                })
            }
        })
    };

    var chartByComposition = {
        chart: { type: 'bar' },
        title: { text: '' },
        xAxis: {
            categories: _.map(byComposition, 'label')
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Осталось тонн'
            }
        },
        legend: { reversed: true },
        plotOptions: {
            series: { stacking: 'normal' }
        },
        series: _.map(byFeedType, (feedType) => {
            return {
                name: feedType.label,
                data: _.map(byComposition, (composition) => {
                    var d = _.filter(composition.byFeedType, (c) => {
                        return c.label === feedType.label;
                    })
                    return _.size(d) ? d[0].balance : 0;
                })
            }
        })
    };

    return {
        byFeedType: byFeedType,
        chartByFeedType: chartByFeedType,
        byComposition: byComposition,
        chartByComposition: chartByComposition,
        current: 'byFeedType'
    }
}
module.exports = convert;