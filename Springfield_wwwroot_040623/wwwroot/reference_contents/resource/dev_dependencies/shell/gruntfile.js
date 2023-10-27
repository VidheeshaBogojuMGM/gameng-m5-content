'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-babel');

    // Command line parameters
    var funcHost = grunt.option('func-host') || '127.0.0.1';

    grunt.initConfig({
        env: {
            test: {NODE_ENV: 'test'},
            coverage: {NODE_ENV: 'coverage'},
            functional: {NODE_ENV: 'functional'},
            bamboo: {NODE_ENV: 'bamboo'},
            chrome: {NODE_ENV: 'bamboo', BROWSER_ENV: 'chrome'},
            firefox: {NODE_ENV: 'bamboo', BROWSER_ENV: 'firefox'},
            safari: {NODE_ENV: 'bamboo', BROWSER_ENV: 'safari'},
            vars: {
                FUNC_HOST: funcHost
            }
        },
        //Using mochaTest instead of cafemocha to run tests to accommodate the "should" library constraints
        mochaTest: {
            test: {
                options: {
                    ui: 'bdd',
                    reporter: 'spec'
                },
                src: ['test/unit/*.js']
            },
            functional: {
                options: {
                    ui: 'bdd',
                    reporter: 'spec'
                },
                src: ['test/func/reporting_libraries/*.js', 'test/func/*.js']
            }
        },
        mocha_istanbul: {
            coverage: {
                src: 'test/unit',
                options: {
                    mask: '*.js'
                }
            }
        },
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            app: {
                files: ['app.js'],
                tasks: ['nodemon']
            }
        },
        open: {
            module: {
                path: 'http://localhost:3000/',
                app: 'Google Chrome',
                options: {
                    delay: 200
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'open:module', 'node-inspector'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        jasmine: {
            coverage: {
                src: [
                    'js/bannerController.js',
                    'js/shellSizing.js',
                    'js/sizeTable.js',
                    'js/bannerSizeTable.js',
                    'js/errorHandler.js'
                ],
                options: {
                    specs: [
                        'test/unit/shellSizingSpec.js',
                        'test/unit/bannerControllerSpec.js',
                        'test/unit/errorHandlerSpec.js'
                    ],
                    template: require('grunt-template-jasmine-istanbul'),
                    vendor: [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/bootstrap/dist/js/bootstrap.js',
                        'node_modules/loglevel/dist/loglevel.js'
                    ],
                    templateOptions: {
                        coverage: 'test/coverage/coverage.json',
                        report: {
                            type: 'lcov',
                            options: {
                                dir: 'test/coverage'
                            }
                        }
                    }
                }
            }
        },
        jsdoc: {
            dist: {
                src: 'js/*.js',
                options: {
                    destination: 'jsdoc'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.registerTask('serve', ['concurrent:dev']);
    grunt.registerTask('functional', ['env:vars', 'env:functional', 'mochaTest:functional']);
    grunt.registerTask('bamboo', ['env:bamboo', 'mochaTest:functional']);
    grunt.registerTask('test', ['jasmine:coverage']);
    grunt.registerTask('doc', ['jsdoc']);
};
