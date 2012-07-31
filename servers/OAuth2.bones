var passport = require('passport'); 
var strategy = require('passport-oauth').OAuth2Strategy;

server = servers.PassportOAuth.extend({
    key: 'oauth2',
    strategy: strategy
});
