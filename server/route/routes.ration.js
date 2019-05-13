var Q = require('q');
var _ = require('lodash');
var Ration = require('../models/ration');
var edit = require('../ration/ration.edit');
var list = require('../ration/ration.list');
var view = require('../ration/ration.view');
var lang = require('../ration/ration.lang');
var utils = require('../ration/ration.utils');
var history = require('../ration/ration.history');
var feeding = require('../ration/ration.feeding');


module.exports = function(app, isAuthenticated, errorHandler, log) {
    
    function checkUserRightForRation(ration, req, res) {
        var check = ration.createdBy.tenantId.equals(req.user.tenantId);
        if (res && !check) {
            res.status(403).send({
                message: 'You dont have permission for this object.'
            });
            return false;
        }
        return check;
    }
    // get rations for ration list
    app.get('/api/rations', isAuthenticated, function(req, res) {
        Ration.find({
            'createdBy.tenantId': req.user.tenantId
        }).lean().exec(function(err, rations) {
            if (err) {
                return errorHandler(err, req, res);
            }
            // double check checkUserRightForFeed
            rations = _.filter(rations, function(f) {
                return checkUserRightForRation(f, req);
            });
            res.json(list(rations));
        });
    });

    // get ration skeleton
    app.post('/api/rations/new', isAuthenticated, function(req, res) {
        res.json(edit(null, req.user));
    });

    // delete feed by id
    app.delete('/api/rations/:ration_id', isAuthenticated, function(req, res) {
        var canEdit = req.user.permissions.indexOf('admin') > -1 || req.user.permissions.indexOf('write') > -1;
        if (!canEdit) {
            return res.status(406).json({
                message: 'Недостаточно прав'
            });
        }
        Ration.remove({
            _id: req.params.ration_id
        }, function(err, bear) {
            if (err) {
                return errorHandler(err, req, res);
            }

            res.json({
                message: 'OK',
                id: req.params.ration_id
            });
        });
    });

    // new ration
    app.post('/api/rations', isAuthenticated, function(req, res) {
        if (!req.user._id || !req.user.tenantId || !req.user.permissions) {
            return res.status(406).json({
                message: 'Недостаточно прав'
            });
        }
        var canEdit = req.user.permissions.indexOf('admin') > -1 || req.user.permissions.indexOf('write') > -1;
        if (!canEdit) {
            return res.status(406).json({
                message: 'Недостаточно прав'
            });
        }

        var ration = new Ration();
        ration.createdAt = new Date();
        ration.changeAt = new Date();
        // set userId and tenantId
        ration.createdBy = {
            userId: req.user._id,
            tenantId: req.user.tenantId
        }
        ration.general = req.body.general;
        ration.composition = req.body.composition;
        ration.save(function(err, newRation) {
            if (err) {
                return errorHandler(err, req, res);
            } else {
                res.json({
                    message: 'OK',
                    id: newRation._id
                });
            }
        });
    });

    // get ration by id for view mode
    app.get('/api/rations/:ration_id/view', isAuthenticated, function(req, res) {
        Ration.findById(req.params.ration_id).lean().exec(function(err, ration) {
            if (err) {
                return errorHandler(err, req, res);
            }
            if (ration === null) {
                return res.status(406).json({
                    message: 'Нет рациона с таким идентификатором.'
                });
            }
            if (checkUserRightForRation(ration, req, res)) {
                return res.json(view(ration, req.user));
            } else {
                return res.status(406).json({
                    message: 'Недостаточно прав.'
                })
            }
        });
    });

    // get ration by id for edit mode
    app.get('/api/rations/:ration_id/edit', isAuthenticated, function(req, res) {
        Ration.findById(req.params.ration_id).lean().exec(function(err, ration) {
            if (err) {
                return errorHandler(err, req, res);
            }

            if (ration === null) {
                return res.status(406).json({
                    message: 'Нет рациона с таким идентификатором.'
                });
            }

            if (checkUserRightForRation(ration, req, res)) {
                res.json(edit(ration, req.user));
            }  else {
                return res.status(406).json({
                    message: 'Недостаточно прав.'
                })
            }
        });
    });

    // copy ration
    app.get('/api/rations/:ration_id/copy', isAuthenticated, function(req, res) {
        Ration.findById(req.params.ration_id).lean().exec(function(err, ration) {
            if (err) {
                return errorHandler(err, req, res);
            }

            if (ration === null) {
                return res.status(406).json({
                    message: 'Нет рациона с таким идентификатором.'
                });
            }

            if (checkUserRightForRation(ration, req, res)) {
                var copyRation = new Ration();
                copyRation.createdAt = new Date();
                copyRation.changeAt = new Date();
                // set userId and tenantId
                copyRation.createdBy = {
                    userId: req.user._id,
                    tenantId: req.user.tenantId
                }
                copyRation.general = ration.general;
                copyRation.general.number = 'Копия-' + ration.general.number;
                copyRation.general.name = 'Копия-' + ration.general.name;

                copyRation.composition = ration.composition;

                console.log(copyRation);

                copyRation.save(function(err, newRation) {
                    if (err) {
                        return errorHandler(err, req, res);
                    } else {
                        res.json({
                            message: 'OK',
                            id: newRation._id
                        });
                    }
                });
            }  else {
                return res.status(406).json({
                    message: 'Недостаточно прав.'
                })
            }
        });
    });

    // update ration by id
    app.put('/api/rations/:ration_id', isAuthenticated, function(req, res) {
        var canEdit = req.user.permissions.indexOf('admin') > -1 || req.user.permissions.indexOf('write') > -1;
        if (!canEdit) {
            return res.status(406).json({
                message: 'Недостаточно прав'
            });
        }
        Ration.findById(req.params.ration_id, function(err, ration) {
            if (err) {
                return errorHandler(err, req, res);
            }
            if (checkUserRightForRation(ration, req, res)) {

                // update history
                // if any history filed is chnaged
                if (_.some(utils.historyFields, (value, key) => {
                    return req.body.general[key] !== ration.general[key];
                })) {
                    ration.history.push(_.merge(
                        {
                            date: new Date()
                        },
                        _.pick(req.body.general, _.keys(utils.historyFields))
                    ));
                }

                // !!! do not update createdBy and createdAt !!!
                ration.general = req.body.general;
                ration.composition = req.body.composition;
                ration.distribution = req.body.distribution;
                ration.changeAt = new Date();

                ration.save((err, updatedRation) => {
                    if (err) {
                        return errorHandler(err, req, res);
                    } else {
                        res.json({
                            message: 'OK',
                            id: updatedRation._id
                        });
                    }
                });    
            }
        });
    });

    // get ration history
    app.put('/api/rations/:ration_id/history', isAuthenticated, function(req, res) {
        Ration.findById(req.params.ration_id, function(err, ration) {
            if (err) {
                return errorHandler(err, req, res);
            }
            if (checkUserRightForRation(ration, req, res)) {
                res.json(ration.history);
            }
        });
    });

    app.get('/api/rations/dashboard', isAuthenticated, function(req, res) {
        // set user actions for Ration module
        Ration.find({
            'createdBy.tenantId': req.user.tenantId,
            'general.endDate': null
        }).lean().exec(function(err, rations) {
            var actions = [];
            req.user.permissions.indexOf('sa') > -1 && actions.unshift('addRation');

            // remove actions for now
            //actions = [];

            const milkRations = _.filter(rations, (r) => { return r.general.rationType === 'milk' });
            return res.status(200)
                .json({
                    milkRationHistroy: history.getMilkHistory(milkRations),
                    currentRations: _.map(rations, (ration) => {
                        const rationHistory = history.getHistoryForRation(ration);
                        return {
                            _id: ration._id,
                            showChart: false,
                            general: ration.general,
                            categories: rationHistory.categories,
                            series: rationHistory.series
                        }
                    }),
                    actions: _.map(actions, function(f) {
                        return {
                            key: f,
                            label: lang(f)
                        };
                })
            });
        });
    });

    // get feeding
    app.post('/api/rations/distribution', isAuthenticated, function(req, res) {
        var rationIds = req.body.rationIds;
        var promises = _.map(rationIds, (id) => {
            return Ration.findById(id);
        });
        Q.all(promises).then(function(rations) {
            rations = _.filter(rations, (r) => {
                return checkUserRightForRation(r, req);
            });
            res.status(200).json(feeding(rations));
        }, function(err) {
            res.send(err);
        });
    });
}