var passport = require('passport');
var util = require('util');

// Define how we serialize the user data.
passport.serializeUser(function(user, done) {
    done(null, user);
});

// Define how we deserialize the user data.
passport.deserializeUser(function(obj, done) {
    done(null, new models.User(obj));
});

server = Bones.Server.extend({
    options: {},
    initialize: function(app) {
        var that = this;

        var options = app.config && app.config.passport && app.config.passport[this.key];
        this.options.sessionKey = 'auth:' + this.key;
        options && _.extend(this.options, options);

        // store the strategy instance in a separate variable so it can be access easily.
        var strategy = new this.strategy(this.options, this.validate);

        // mount the passport strategy.
        passport.use(strategy);

        // give the request access to the strategy instance
        // to allow re-use of the oauth instance to make requests.
        this.use(function(req, res, next) {
            req.passportStrategy = strategy;
            next();
        });

        this.use(passport.initialize());
        this.use(passport.session());
        this.use(this.router);
        this.get('/auth/' + this.key, passport.authenticate(this.key,
            { successRedirect: '/', failureRedirect: '/error' }));

        this.get('/logout', function(req, res){
            req.logout();
            res.redirect('/');
        });
    }
});
