'use strict';
var passport = require('passport');
var Strategy = require('passport-strategy');
var util = require('util');
var _ = require('lodash');
// models ======================================================================
var Tenant = require('../models/tenant');
var User = require('../models/user');

function CustomStrategy(app) {
    
    Strategy.call(this);
    
    // required for passport
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        console.log('passport.deserializeUser');
        done(null, user);
    });
}
util.inherits(CustomStrategy, Strategy);
CustomStrategy.prototype.authenticate = function(req, callback) {
    var tenantname = req.body.tenantname;
    var username = req.body.username;
    var password = req.body.password;
    // get tenant by name
    Tenant.findOne({
        loginName: tenantname
    }, function(err, _tenant) {
        // if err
        if (err) {
            callback(err, null);
        } else if (_tenant) {

            // get user by name
            var selector;
            if (username === 'sa') {
                selector = User.findOne({
                    name: username,
                    permissions: ['sa', 'admin']
                });
            } else {
                selector = User.findOne({
                    name: username,
                    tenantId: _tenant._id
                });    
            }
            selector.select('+password').exec(function(err, _user) {
                if (err) {
                    callback(err, null);
                } else if (_user) {
                    console.log(_user);
                    if (_user.password === password && 
                        (
                            _.first(_user.permissions) === 'sa' || 
                            (_user.tenantId && _user.tenantId.equals(_tenant._id))
                        )
                    ) {

                        // IMPORTANT: delete password and salt
                        _user.password = undefined;
                        _user.salt = undefined;
                        callback(null, _user, _tenant);
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            })
        } else {
            callback();
        }
    });
};
// export ======================================================================
module.exports = CustomStrategy;