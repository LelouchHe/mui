
var assign = require('object-assign');
var base = require('./karma.base.config');

module.exports = function(config) {
    var options = assign(base, {
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            reporters: [
                // subdir used to remove browser-specific folder
                { type: 'lcov', dir: '../coverage', subdir: '.' },
                { type: 'text-summary', dir: '../coverage', subdir: '.' }
            ]
        }
    });

    options.webpack.module.postLoaders = [
        {
            test: /\.js$/,
            exclude: /test|node_modules|_spec\.js$/,
            loader: 'istanbul-instrumenter'
        }
    ];

    config.set(options);
}
