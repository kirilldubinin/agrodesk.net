var lang = require('./lang');
var _ = require('lodash');

function getFeedIconName (feed) {
    const feedType = feed.general.feedType;
    if (feedType === 'haylage' || feedType === 'greenWeight') {
        return 'grass';
    } else if (feedType === 'silage') {
        return 'corn';
    } else if (feedType === 'grain' || feedType === 'cornSilage') {
        return 'grain';
    }
    return null;
}

function sortFeeds (a,b) {
    
    // if harvest and harvest.end DateTime format
    if (a.harvest && b.harvest &&
    	a.harvest.end && a.harvest.end.getTime && 
    	b.harvest.end && b.harvest.end.getTime) {
        return b.harvest.end.getTime() - a.harvest.end.getTime();    
    } 
    // else sort by generak.year
    else {
        return b.general.year - a.general.year;
    }
}

function list(feeds) {

	//feed.general.name and feed.general.year is REQUIRED for any feed

	//sort
    // all opened: true
    // all closed: true
    // all done: true
    var opened = _.filter(feeds, function(f) {
        return f.general.opened && !f.general.done;
    }).sort(sortFeeds);
    var closed = _.filter(feeds, function(f) {
        return !f.general.opened && !f.general.done;
    }).sort(sortFeeds);
    var sortedFeeds = _.concat(opened, closed);
    var shortFeeds = _.map(sortedFeeds, function(feed) {
        
        if (!feed.general.name) {
            feed.general.name = lang(feed.general.feedType) + ':' + feed.general.composition;
        }

        return _.merge({}, feed.general, {
            _id: feed._id,
            icon: getFeedIconName(feed),
            dryMaterial: _.size(feed.analysis) ? (_.last(feed.analysis).dryMaterial / 100) : undefined,
            feedType: lang(feed.general.feedType)
        });
    });

    return {
        feeds: shortFeeds
    };
}

module.exports = list;