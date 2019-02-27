// set up ======================================================================
var Q = require('q');
var _ = require('lodash');
// models ======================================================================
var Ration = require('../models/ration');
// helpers =====================================================================
var edit = require('../ration/ration.edit');
var list = require('../ration/ration.list');
var view = require('../ration/ration.view');
var lang = require('../ration/ration.lang');

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
            'createdBy.tenantId': req.user.tenantId,
            'historyId': null
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
        res.json(edit());
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
                res.json(edit(ration));
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

                // !!! do not update createdBy and createdAt !!!
                ration.general = req.body.general;
                ration.composition = req.body.composition;
                ration.changeAt = new Date();

                // save ration history
                var rationHistory = new Ration();
                rationHistory.createdAt = ration.createdAt;
                rationHistory.changeAt = new Date();
                // set userId and tenantId
                rationHistory.createdBy = {
                    userId: req.user._id,
                    tenantId: req.user.tenantId
                }
                rationHistory.general = ration.general;
                rationHistory.composition = ration.composition;
                rationHistory.historyId = req.params.ration_id;

                rationHistory.save((err, history) => {

                    if (err) {
                        return errorHandler(err, req, res);
                    } else {
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
            }
        });
    });

    app.get('/api/rations/dashboard', isAuthenticated, function(req, res) {
        // set user actions for Ration module
        Ration.find({
            'createdBy.tenantId': req.user.tenantId,
            'general.endDate': null,
            'historyId': null
        }).lean().exec(function(err, rations) {
            var actions = ['chartsRation'];
            var canAdd = (req.user.permissions.indexOf('admin') > -1 || req.user.permissions.indexOf('write') > -1);
            if (canAdd) {
                actions.unshift('addRation');
            }
            return res.status(200)
                .json({
                    //history: _.map(history, 'general'),
                    actions: _.map(actions, function(f) {
                        return {
                            key: f,
                            label: lang(f)
                        };
                })
            });
            // get histroy
            if (_.size(rations)) {
                console.log('_.first(rations)._id', _.first(rations)._id);
                Ration.find({
                    'createdBy.tenantId': req.user.tenantId,
                    'historyId': '5c75ad1f93705d14fcc5bfe2'
                }).lean().exec(function(err, history) {
                    var actions = ['chartsRation'];
                    var canAdd = (req.user.permissions.indexOf('admin') > -1 || req.user.permissions.indexOf('write') > -1);
                    if (canAdd) {
                        actions.unshift('addRation');
                    }

                    res.status(200)
                        .json({
                            history: _.map(history, 'general'),
                            actions: _.map(actions, function(f) {
                                return {
                                    key: f,
                                    label: lang(f)
                                };
                        })
                    });
                });
            }
        });
    });
}