var passport = require('passport');
var strategy = require('passport-twitter').Strategy;

server = servers.PassportOAuth.extend({
    key: 'twitter',
    strategy: strategy
});

