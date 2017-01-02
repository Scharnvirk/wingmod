var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var fs = require('fs');
var nodemon = require('nodemon');
var SOURCE_PATH = 'src';
var LOG_PATH = 'gulpLog.txt';
var VERSION_PATH = 'version';

var buildIds = [];

var sources = [
    {
        src: SOURCE_PATH + '/Init.js',
        output: 'Init.js',
        dest: 'dist/'
    },
    {
        src: SOURCE_PATH + '/LogicInit.js',
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

function pad(value) {
    if(value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}

function buildCurrentTimeString(){
    var time = new Date();
    return '[' + pad(time.getHours()) + ":" + pad(time.getMinutes()) + ":" + pad(time.getSeconds()) + ']';
}

function onError(buildInfo, message){
    var time = buildCurrentTimeString();
    var completeMessage = time + ' ' + message + '\n';
    fs.appendFileSync(LOG_PATH, completeMessage);

    if(buildInfo.lastBuildId !== buildIds[buildInfo.src]){
        console.log(time + ' [ERROR] Build failure in ' + buildInfo.src + '. Refer to ' + LOG_PATH + ' for details.');
        buildInfo.lastBuildId = buildIds[buildInfo.src];
    }
}

function onSuccess(config){
    var time = buildCurrentTimeString();
    var version = JSON.parse(fs.readFileSync(VERSION_PATH, "utf8"));
    version.build ++;
    fs.writeFileSync(VERSION_PATH, JSON.stringify(version));

    var versionString = version.major + '.' + version.minor + '.' + version.patch + '.' + version.build;

    console.log(time + ' Build complete! Current version: ' + versionString + ' [' + config.src + ']');
}

function rebundle(bundler, config){
    if(!buildIds[config.src]){
        buildIds[config.src] = 0;
    }

    bundler.bundle()
    .on('end', onSuccess.bind(this, config))
    .on('error', onError.bind(this, {src: config.src, lastBuildId: buildIds[config.src]}))
    .pipe(source(config.output))
    .pipe(gulp.dest(config.dest));

    buildIds[config.src] ++;
}

function createBundle(config, watching){
    var bundler = browserify(
        Object.assign(
            {},
            watchify.args,
            {
                entries:config.src,
                paths: ['./node_modules', './' + SOURCE_PATH]
            },
            customOptions
        )
    );

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
            dest: bundle.dest,
        }, watching);
    });
}

gulp.task('build', function(){
    createBundles(sources, false);
});

gulp.task('watch', function(){
    nodemon({
        script: 'server.js',
        ext: 'js',
        watch: ['dist/', 'styles.css', 'index.html']
    });
    createBundles(sources, true);
});

gulp.task('default', ['asd']);
