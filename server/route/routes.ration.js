// set up ======================================================================
var Q = require('q');
var _ = require('lodash');
// models ======================================================================
var Feed = require('../models/feed');
var Tenant = require('../models/tenant');
var User = require('../models/user');
var Catalog = require('../models/catalog');
var Ration = require('../models/ration');
// helpers =====================================================================
var edit = require('../ration/ration.edit');
var list = require('../ration/ration.list');
var view = require('../ration/ration.view');

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
    app.get('/api/rations/dashboard', isAuthenticated, function(req, res) {
        
    });
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

    // update route by id
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
                ration.save(function(err, updatedRation) {
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
}