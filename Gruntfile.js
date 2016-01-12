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
                        dest : 'dist/b/'
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
                src : 'dist/b/**/*.js',
                dest : 'dist/trig.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['babel','uglify']);



};
