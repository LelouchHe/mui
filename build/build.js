var fs = require('fs');
var zlib = require('zlib');
var rollup = require('rollup');
var uglify = require('uglify-js');
var babel = require('rollup-plugin-babel');
var package = require("../package.json");
var name = package.name;

var distPath = 'dist';
var libFilename = distPath + '/' + name + '.js';
var libCommonFilename = distPath + '/' + name + '.common.js';
var libMiniFilename = distPath + '/' + name + '.min.js';
var libMiniZipFilename = libMiniFilename + '.zip';

// CommonJS build.
// this is used as the "main" field in package.json
// and used by bundlers like Webpack and Browserify.
rollup.rollup({
    entry: 'src/index.js',
    plugins: [
        babel()
    ]
})
.then(function (bundle) {
    return write(libCommonFilename, bundle.generate({
        format: 'cjs'
    }).code);
})
// Standalone Dev Build
.then(function () {
    return rollup.rollup({
        entry: 'src/index.js',
        plugins: [
            babel()
        ]
    })
    .then(function (bundle) {
        return write(libFilename, bundle.generate({
            format: 'umd',
            moduleName: name
        }).code);
    })
})
.then(function () {
    // Standalone Production Build
    return rollup.rollup({
        entry: 'src/index.js',
        plugins: [
            babel()
        ]
    })
    .then(function (bundle) {
        var code = bundle.generate({
            format: 'umd',
            moduleName: name
        }).code;
        var minified = uglify.minify(code, {
            fromString: true,
            output: {
                ascii_only: true
            }
        }).code;
        return write(libMiniFilename, minified);
    })
    .then(zip);
})
.catch(logError);

function write (dest, code) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(dest, code, function (err) {
            if (err) {
                return reject(err);
            }
            resolve();
        })
    })
}

function zip () {
    return new Promise(function (resolve, reject) {
        fs.readFile(libMiniFilename, function (err, buf) {
            if (err) {
                return reject(err);
            }
            zlib.gzip(buf, function (err, buf) {
                if (err) {
                    return reject(err);
                }
                write(libMiniZipFilename, buf).then(resolve);
            });
        });
    });
}


function logError (e) {
    console.log(e);
}

