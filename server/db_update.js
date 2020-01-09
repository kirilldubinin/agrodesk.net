// set up ======================================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var database = require('./config/database');
var _ = require('lodash');
var Feed = require('./models/feed');
var Ration = require('./models/ration');
var Tenant = require('./models/tenant');
var Tariff = require('./models/tariff');

// configuration ===============================================================
mongoose.connect(database.localUrl);    // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
var db = mongoose.connection;
db.on('error', function(err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback() {
    console.log("Connected to DB!");
    removeHistoryFromRation();
});

function delete_Ration_History (ready) {
    
    Ration.find().then(function(rations) {

        rations.forEach(function (r){
            r.history.forEach(function (h) {

                //console.log('h1', h);

                h.cowsNumber = null;
                delete h.cowsNumber;

                h.dryMaterialConsumption = null;
                delete h.dryMaterialConsumption;

                h.estimatedProductivity = null;
                delete h.estimatedProductivity;

                h.actualProductivity = null;
                delete h.actualProductivity;

                h.productivityRate = null;
                delete h.productivityRate;

                h.dryMaterialTMR = null;
                delete h.dryMaterialTMR;

                h.ratio = null;
                delete h.ratio;

                h.fat = null;
                delete h.fat;

                h.protein = null;
                delete h.protein;

                h.rationPrice = null;
                delete h.rationPrice;

                h.milkPrice = null;
                delete h.milkPrice;

                h.efficiency = null;
                delete h.efficiency;
            });
            
            r.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(r.general.name);
                }
            });
        });
    });
}

function add_Ration_History (ready) {
    
    Ration.find().then(function(rations) {

        rations.forEach(function (r){
            r.history.forEach(function (h) {

                //console.log('h1', h);

                h.general = {
                    cowsNumber: h.cowsNumber,
                    dryMaterialConsumption: h.dryMaterialConsumption,
                    estimatedProductivity: h.estimatedProductivity,
                    actualProductivity: h.actualProductivity,
                    productivityRate: h.productivityRate,
                    dryMaterialTMR: h.dryMaterialTMR,
                    ratio: h.ratio,
                    fat: h.fat,
                    protein: h.protein,
                    rationPrice: h.rationPrice,
                    milkPrice: h.milkPrice,
                    efficiency: h.efficiency
                };

                h.composition = [];

                h.cowsNumber = null;
                delete h.cowsNumber;

                h.dryMaterialConsumption = null;
                delete h.dryMaterialConsumption;

                h.estimatedProductivity = null;
                delete h.estimatedProductivity;

                h.actualProductivity = null;
                delete h.actualProductivity;

                h.productivityRate = null;
                delete h.productivityRate;

                h.dryMaterialTMR = null;
                delete h.dryMaterialTMR;

                h.ratio = null;
                delete h.ratio;

                h.fat = null;
                delete h.fat;

                h.protein = null;
                delete h.protein;

                h.rationPrice = null;
                delete h.rationPrice;

                h.milkPrice = null;
                delete h.milkPrice;

                h.efficiency = null;
                delete h.efficiency;
            });
            
            r.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(r.general.name);
                }
            });
        });
    });
}

function add_Ration_Distributions (ready) {
    
    Ration.find().then(function(rations) {
        rations.forEach(function (r){
            r.general.distribution = null;
            delete r.general.distribution;
            
            r.distribution = {
                mixerSize: 5000,
                ratio: [100]
            };
            r.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(r.general.name);
                }
            });  
        });
    });
}

function add_Tariff_Plans (ready) {
    var tariff = new Tariff();
    tariff.module = 'feed';
    tariff.plan = 'under_40';

    tariff.save(function (err, newTariff) {
        if (err) {
            console.log(err);
        } else {
            console.log(newTariff);
        }   
    });
}

function addField_productivityRate_for_RATION_general () {
    Ration.find().then(function(rations) {
        rations.forEach(function (r){
            r.general.productivityRate = 1;
            r.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
}

function addField_endDate_for_RATION_general () {
    Ration.find().then(function(rations) {
        rations.forEach(function (r){
            
            r.general.endDate = null;
            r.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
}

function addField_autoDecrement_for_FEED_feeding () {
    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            
            if (feed.feeding.autoDecrement === undefined) {
                console.log('update feed with name: ' + feed.general.name);
                feed.feeding.autoDecrement = false;
            }

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
}

function addField_status_for_TENANT () {

    Tenant.find().then(function(tenants) {
        tenants.forEach(function (tenant){

            tenant.status = tenant.loginName === 'im-gorky' ? 'paid' : 'paid';
            tenant.save(function(err, _tenant) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
}

function addField_license_for_TENANT () {

    Tenant.find().then(function(tenants) {
        tenants.forEach(function (tenant){

            if (tenant.license.feed.endDate === undefined) {
                console.log('update feed with name: ' + tenant.loginName);
                tenant.license.feed = {
                    endDate: new Date('01/01/2018'),
                    tariffPlan: '58d18c84542a803bd64feccc'    
                }

                tenant.save(function(err, _tenant) {
                    if (err) {
                        console.log(err);
                    }
                });  
            }
        });
    });
}

function addField_storageType_for_FEED_GENERAL () {
    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            
            if (feed.general.storageType === undefined) {
                console.log('update feed with name: ' + feed.general.name);
                feed.general.storageType = null;
            }

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
}

function addField_price_for_FEED_GENERAL () {
    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            
            if (feed.general.price === undefined) {
                console.log('update feed with name: ' + feed.general.name);
                feed.general.price = null;
            }

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
}

function addField_branch_for_FEED_GENERAL () {
    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            
            if (feed.general.branch === undefined) {
                console.log('update feed with name: ' + feed.general.name);
                feed.general.branch = null;
            }

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
}

function addField_SW_for_FEED_ANALYSIS () {

    console.log('addField_CODE_for_FEED_ANALYSIS');

    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){

            feed.analysis.forEach(function (analys) {
                if (analys.sw === undefined) {
                    console.log('update feed with name: ' + feed.general.name);
                    analys.sw = null;
                }
            });

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                } else {
               }
            });  
        });
    });
} 

function addField_starchPassesPercent_for_FEED_ANALYSIS () {

    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            feed.analysis.forEach(function (analys) {
                if (analys.starchPassesPercent === undefined) {
                    console.log('update feed with name: ' + feed.general.name);
                    analys.starchPassesPercent = 0;
                }
            });

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
} 

function addField_CODE_for_FEED_ANALYSIS () {

	console.log('addField_CODE_for_FEED_ANALYSIS');

	Feed.find().then(function(feeds) {
    	
		console.log(feeds.length + ' was found');

        console.log(feeds);

        feeds.forEach(function (feed){

    		feed.analysis.forEach(function (analys) {
        		if (analys.code === undefined) {

        			console.log('update feed with name: ' + feed.general.name);
        			analys.code = analys.number;
        		}
        	});

        	feed.save(function(err, _feed) {
                if (err) {
                	console.log(err);
                } else {
                	console.log(_feed.general.name);
                	console.log(_feed.analysis[0].code);

                	Feed.findOne({_id: _feed._id}).then(function(f) {
                	});
                }
            });  
        });
    });
} 

function removeHistoryFromRation() {
    //5e17721fe342ab24e56c03ad

    Ration.find().then(function(rations) {
        rations.forEach(r => {
            if (r._id.equals('5e17721fe342ab24e56c03ad')) {
                r.history.pull({ _id: '5e1778f8e342ab24e56c03b3' })
                r.save(function (err, _r) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(_r);
                    }
                });
            }
        })
    });

}

function addRatioAndMixerAndCowsNumberToRation () {
    Ration.find().then(function(rations) {
        rations.forEach(r => {
            if (!r.distribution.ratio || _.size(r.distribution.ratio)) {
                r.distribution.ratio = [100]
            }

            if (!r.distribution.mixerSize) {
                r.distribution.mixerSize = 1000;
            }

            if (!r.general.cowsNumber) {
                r.general.cowsNumber = 50;
            }

            r.save(function (err, _r) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('done');
                }
            });
        })
    });
}

