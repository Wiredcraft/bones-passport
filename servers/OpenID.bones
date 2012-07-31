var passport = require('passport');
var strategy = require('passport-openid').OpenIDStrategy;

passport.use(new OpenIDStrategy({
    returnURL: 'http://localhost:3000/auth/openid/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, done) {
    User.findByOpenID({ openId: identifier }, function (err, user) {
      return done(err, user);
    });
  }
));


server = servers.Passport.extend({
    key: 'openid',
    strategy: strategy,

    validate: function(identifier, done) {
        // Temporarily place the open-id credentials in the session
        _.extend(profile, { openId: { token: token, token_secret: tokenSecret } });

        return done(null, profile);
    }

});

server.augment({
    initialize: function(parent, app) {
        // weird inconsistency between openid and oauth: returnURL vs. callbackURL. default to callback for now.
        _.extend(this.options, {
            returnURL: 'http://localhost:3000/auth/' + this.key + '/callback',
            realm: 'http://localhost:3000/'
        });

        parent.call(this, app);

        this.get('/auth/' + this.key + '/callback',
            passport.authenticate(this.key), function(req, res, next) {
                // add the query parameters to the user object.
                // This should be done by the oauth library, but for some reason
                // it doesn't behave correctly with some variables.
                // see: https://github.com/jaredhanson/passport-oauth/issues/1
                _.extend(req.user, req.query);

                // we don't want the query argument oauth_token
                // in the user record.
                delete req.user.oauth_token;

                // Move the oauth credentials into the session proper,
                // not the user record. This means we can push the
                // user record to the client without leaking secrets.
                req.session.oauth = req.user.oauth;
                delete req.user.oauth;

                // TODO: decide wether we want to redirect always.
                // this is currently quite hard to bypass.
                res.redirect('/');

            });
    }
});
