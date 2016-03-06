var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

var sources = [
    {
        src: 'node_modules/wm/Init.js',
        output: 'Init.js',
        dest: 'dist/'
    },
    {
        src: 'node_modules/wm/LogicInit.js',
        output: 'LogicInit.js',
        dest: 'dist/'
    }
];

var customOptions = {
    transform: [
        ["babelify", {
            presets: ["es2015", "react"]
        }]
    ]
};

function rebundle(bundler, config){
    bundler.bundle()
    .on('error', function(){console.log(arguments); })
    .pipe(source(config.output))
    .pipe(gulp.dest(config.dest));
}

function createBundle(config, watching){
    var bundler = browserify( Object.assign({}, watchify.args, {entries:config.src}, customOptions));

    if(watching){
        bundler = watchify(bundler);
        bundler.on('update', rebundle.bind(this, bundler, config));
    }

    rebundle(bundler, config);
}

function createBundles(bundles, watching){
    bundles.forEach(function(bundle){
        createBundle({
            src: bundle.src,
            output: bundle.output,
            dest: bundle.dest
        }, watching);
    });
}

gulp.task('build', function(){
    createBundles(sources, false);
});

gulp.task('watch', function(){
    createBundles(sources, true);
});

gulp.task('default', ['asd']);
