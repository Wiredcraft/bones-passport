var passport = require('passport');
var strategy = require('passport-twitter').Strategy;

server = servers.OAuth.extend({
    key: 'twitter',
    strategy: strategy
});

