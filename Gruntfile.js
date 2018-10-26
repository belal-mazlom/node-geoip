'use strict';

var request = require('request');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var reloadPort = 35729, files;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        develop: {
            server: {
                file: 'bin/www'
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'public/css'
                }
            }
        },
        watch: {
            options: {
                nospawn: true,
                livereload: reloadPort
            },
            server: {
                files: [
                    'bin/www',
                    'app.js',
                    'routes/*.js'
                ],
                tasks: ['develop', 'delayed-livereload']
            },
            js: {
                files: [
                    'public/js/*.js',
                    'public/js/*/*.js'
                ],
                options: {
                    livereload: reloadPort
                }
            },
            css: {
                files: [
                    'public/css/*.css'
                ],
                options: {
                    livereload: reloadPort
                }
            },
            sass: {
                files: [
                    'sass/*.scss',
                    'sass/partials/*.scss',
                    'sass/partials/*/*.scss'
                ],
                tasks: ['compass:dist']
            },
            views: {
                files: [
                    'views/*.pug',
                    'views/*/*.pug'
                ],
                options: {
                    livereload: reloadPort
                }
            }
        },


        uglify: {
            dist: {
                files: [
                    {
                        src: ['public/js/*.js'],
                        dest: 'public/dist/scripts.min.js'
                    }
                ],
                // This is to remove console.*
                options: {
                    compress: {
                        drop_console: true
                    }
                }
            }
        },

        cssmin: {
            dist: {
                files: [
                    {
                        src: ['public/css/*.css'],
                        dest: 'public/dist/styles.min.css'
                    }
                ]
            }
        },

        compress: {
            dist: {
                options: {
                    mode: 'gzip'
                },
                files: [
                    {
                        src: ['public/dist/*.min.*'],
                        dest: 'public/dist/gzip',
                        ext: '.gzip',
                        expand: true
                    }
                ]
            }
        },

        copy: {
            build: {
                // src: ['**'],
                src: ['public/dist/**'],
                dest: 'build',
                expand: true
            }
        },

        clean: {
            build: {
                // src: ['build']
                src: ['public/dist']
            }
        }


    });

    grunt.config.requires('watch.server.files');
    files = grunt.config('watch.server.files');
    files = grunt.file.expand(files);

    grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
        var done = this.async();
        Timeout(function () {
            request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','), function (err, res) {
                var reloaded = !err && res.statusCode === 200;
                if (reloaded) {
                    grunt.log.ok('Delayed live reload successful.');
                } else {
                    grunt.log.error('Unable to make a delayed live reload.');
                }
                done(reloaded);
            });
        }, 500);
    });

    grunt.registerTask('build', 'Build app for production.', [
        'clean',
        'uglify',
        'compass',
        'cssmin'
    ]);

    grunt.registerTask('default', [
        'develop',
        'watch',
    ]);
};
