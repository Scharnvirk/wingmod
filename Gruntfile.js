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
                mangle: true,
                compress: true,
                sourceMap: true,
                sourceMapName: 'dist/sourceMap.map'
            },
            logic: {
                src : ['dist/b/Utils.js','dist/b/renderer/actorManagement/ActorFactory.js','dist/b/logic/**/*.js'],
                dest : 'dist/logic.min.js'
            },
            renderer: {
                src : ['dist/b/Init.js','dist/b/Utils.js','dist/b/renderer/**/*.js'],
                dest : 'dist/renderer.min.js'
            },
            logicInit: {
                src : ['dist/b/LogicInit.js'],
                dest : 'dist/logicInit.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['babel','uglify']);



};
