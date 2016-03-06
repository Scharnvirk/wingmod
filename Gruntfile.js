module.exports = function (grunt) {
    grunt.initConfig({

        browserify: {
            dist: {
                options: {
                    transform: [
                        ["babelify", {
                            presets: ["es2015", "react"]
                        }]
                    ]
                },
                files:[
                    {
                        src: 'node_modules/wm/Init.js',
                        dest: 'dist/Init.js'
                    },
                    {
                        src: 'node_modules/wm/LogicInit.js',
                        dest: 'dist/LogicInit.js'
                    }
                ]
            }
        },
        // babel: {
        //     options: {
        //         sourceMap: true
        //     },
        //     dist: {
        //         files:[
        //             {
        //                 expand: true,
        //                 cwd : 'node_modules/wm/',
        //                 src : ['**/*.js'],
        //                 dest : 'node_modules/wm/b/'
        //             }
        //         ]
        //     }
        // },
        clean: {
            folder: ['node_modules/wm/b']
        }
        // uglify: {
        //     options: {
        //         //mangle: true,
        //         //compress: true,
        //         sourceMap: true,
        //         sourceMapName: function(path) { return path.replace(/.js/,".map");}
        //     },
        //     logic: {
        //         src : [
        //             'dist/b/Utils.js',
        //             'dist/b/Constants.js',
        //             'dist/b/renderer/actorManagement/ActorFactory.js',
        //             'dist/b/logic/**/*.js'
        //         ],
        //         dest : 'dist/logic.min.js'
        //     },
        //     logicInit: {
        //         src : ['dist/b/LogicInit.js'],
        //         dest : 'dist/logicInit.min.js'
        //     },
        //     renderer: {
        //         src : ['dist/b/Init.js','dist/b/Utils.js','dist/b/renderer/**/*.js'],
        //         dest : 'dist/renderer.min.js'
        //     }
        // }
    });

    grunt.loadNpmTasks('grunt-babel');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-watchify");
    grunt.loadNpmTasks('grunt-contrib-clean');
   //grunt.loadNpmTasks("grunt-contrib-watch");

   grunt.registerTask("default", ["browserify"]);


    //grunt.registerTask('default', ['babel','uglify']);




};
