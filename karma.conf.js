var SPEC_PATH = '/test/**/*.js';
var SOURCE_PATH = 'src';

console.log(`Executing test suite; path: ${process.cwd() + SPEC_PATH}`);

module.exports = function (karma) {
    karma.set({
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-browserify'
        ],
        frameworks: [
            'jasmine', 'browserify'
        ],
        // urlRoot: '/__karma/',
        files: [
            'lib/three84.js',
            {pattern: process.cwd() + SPEC_PATH, watched: true, included: true, served: true}
        ],
        preprocessors: {
            'test/**/*.js': [ 'browserify' ]
        },
        // exclude: [
        // ],
        reporters: ['dots'],
        // port: 9876,
        // colors: false,
        // logLevel: 'LOG_WARN',
        browsers: [
            'PhantomJS'
        ],
        browserify: {
            paths: ['./node_modules', './' + SOURCE_PATH],
            debug: true,
            transform: [
                ['babelify', {
                    presets: ['es2015']
                }]
            ]
        },
        autoWatch: true
    });
};
