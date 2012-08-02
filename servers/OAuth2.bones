var passport = require('passport');
var strategy = require('passport-oauth').OAuth2Strategy;

server = servers.OAuth.extend({
    key: 'oauth2',
    strategy: strategy
});

server.augment({
    initialize: function(parent, app) {
        // TODO XXX Important: Adrian never implemented. Make this work.
        this.options.authorizationURL = 'http://localhost:3000';
        this.options.tokenURL = 'http://localhost:3000';
        this.options.clientID = 'fake_id';
        this.options.clientSecret = 'fake_secret';
        parent.call(this, app);
    }
});
