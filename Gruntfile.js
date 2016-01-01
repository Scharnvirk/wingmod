module.exports = function (grunt) {
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files:[
                    {
                        expand: true,
                        cwd : 'src/',
                        src : ['**/*.js'],
                        dest : 'dist/babelified/'
                    }
                ]
            }
        },
        uglify: {
            options: {
                mangle: false,
                compress: true,
                sourceMap: true,
                sourceMapName: 'dist/sourceMap.map'
            },
            src: {
                src : 'dist/babelified/**/*.js',
                dest : 'dist/trig.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['babel','uglify']);



};
