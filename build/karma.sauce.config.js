
// you need to get permission to run on sauce labs

var assign = require('object-assign');
var base = require('./karma.base.config');
var package = require('../package.json');

var launchers = {
    sl_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7',
        version: '35'
    },
    sl_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '30'
    },
    sl_ios_safari: {
        base: 'SauceLabs',
        browserName: 'iphone',
        platform: 'OS X 10.9',
        version: '7.1'
    },
    sl_ie_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
    }
};

module.exports = function(config) {
    config.set(assign(base, {
        browsers: Object.keys(launchers),
        reporters: ['progress', 'saucelabs'],
        customLaunchers: launchers,
        sauceLabs: {
            testName: package.name + ' unit tests',
            recordScreenshots: false
        },
        captureTimeout: 300000,
        browserNoActivityTimeout: 300000
    }));
}
