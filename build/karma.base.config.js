
var webpackConfig = require('./webpack.test.config');
delete webpackConfig.entry;
webpackConfig.devtool = 'inline-source-map';

module.exports = {
    frameworks: ['jasmine'],
    files: [
      '../test/unit/index.js'
    ],
    preprocessors: {
        '../test/unit/index.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,
    webpackMiddleware: {
        noInfo: true
    },

    singleRun: true,
}
