var passport = require('passport');
var strategy = require('passport-openid').Strategy;

server = servers.Passport.extend({
    key: 'openid',
    strategy: strategy
});

server.augment({
    initialize: function(parent, app) {
        var self = this;
        _.bindAll(this);//, /*this.authCallback, */this.validate, this.saveAssociation, this.loadAssociation);

        // weird inconsistency between openid and oauth strategies: returnURL vs. callbackURL. default to callback url for now.
        _.extend(this.options, {
            returnURL: 'http://localhost:3000/auth/' + this.key + '/callback',
            realm: 'http://localhost:3000/'
        });

        // Initialize the strategy, etc.
        parent.call(this, app);

        // Register the association callbacks.
        this.strategy.saveAssociation(function(handle, provider, algorithm, secret, expiresIn, done) {
            // custom storage implementation
            self.saveAssociation(handle, provider, algorithm, secret, expiresIn, function(err) {
                if (err) { return done(err); }
                return done();
            });
        });

        this.strategy.loadAssociation(function(handle, done) {
            // custom retrieval implementation
            self.loadAssociation(handle, function(err, provider, algorithm, secret) {
                if (err) { return done(err); }
                return done(null, provider, algorithm, secret);
            });
        });



        // Authenticate is set up by default to look for a post body field for openid_identifier
        this.post('/auth/' + this.key,
            passport.authenticate('openid'),
            function(req, res) {
            console.log('What the hell happened.');
              // The request will be redirected to the user's OpenID provider for
              // authentication, so this function will not be called.
            });

        this.get('/auth/' + this.key + '/return',
            passport.authenticate(this.key, { failureRedirect: '/auth' }),
            this.authCallback);
    }
});

server.prototype.authCallback = function(req, res) {
    // Successful authentication, redirect home.
    console.log('[debug OpenId.authCallback] something is amiss.');
    res.redirect('/');
};

// Override this whatever verification you would like to use for your project.  By default
// we will use bones-auth.
server.prototype.validate = function(identifier, done) {
    // Retrieve the user session
    console.log('[warning OpenID.validate] implement me.');
    done(null);
};

// Override for maintaining protocol after openid login.
server.prototype.saveAssociation = function(handle, provider, algorithm, secret, expiresIn, callback) {
    console.log('[warning OpenID.saveAssociation] implement me.');
    callback(null);
};

// Override for maintaining protocol after openid login.
server.prototype.loadAssociation = function(handle, callback) {
    console.log('[warning OpenID.loadAssociation] implement me.');
    var err = null;
    var provider = null;
    var algorithm = null;
    var secret = null;
    callback(err, provider, algorithm, secret);
};


