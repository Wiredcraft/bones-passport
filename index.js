// Give all the servers access to Passport.bones first

require('./servers/Passport');

require('bones').load(__dirname);
