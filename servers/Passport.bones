var passport = require('passport');
var util = require('util');
var strategy = require('passport-local').Strategy;

server = Bones.Server.extend({
    options: {},
    key: 'local', // default to a local strategy
    strategy: strategy
});

server.prototype.initialize = function(app) {
    var options = app.config && app.config.passport && app.config.passport[this.key];
    this.options.sessionKey = 'auth:' + this.key;
    options && _.extend(this.options, options);

    // set up passport with custom serialization/deserialization methods.
    passport.serializeUser(this.serializeUser);
    passport.deserializeUser(this.deserializeUser);

    console.log(strategy);
    // store the strategy instance in a separate variable so it can be accessed easily.
    var strategy = new this.strategy(this.options, this.validate);
    this.strategy = strategy;

    // mount the passport strategy.
    passport.use(strategy);

    // give the request access to the strategy instance
    // to allow re-use of the oauth instance to make requests.
    this.use(function(req, res, next) {
        req.passportStrategy = strategy;
        next();
    });

    this.use(passport.initialize());
    //this.use(passport.session()); comment this in if you would to use passport's sessions.
    this.use(this.router);
    this.get('/auth/' + this.key, passport.authenticate(this.key,
        { successRedirect: '/', failureRedirect: '/error' }));

    this.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
};

// Validate the result returned from authentication.
server.prototype.validate = function(done) {
    // TODO: Implement me for a local strategy.
    return done(null);
};

// Override me to implement custom serialization of user data.
server.prototype.serializeUser = function(user, done) {
    done(null, user);
};

//Override me to implement custom deserialization of user data.
server.prototype.deserializeUser = function(user, done) {
    done(null, new models.User(user));
};

