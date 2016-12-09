var webpackTestConfig = require('./webpack.config.js'),
    path = require('path');

webpackTestConfig.entry = {};

module.exports = function(config) {
    config.set({
        basePath: '',
        plugins: [
            'karma-mocha',
            'karma-chai-sinon',
            'karma-webpack',
            'karma-phantomjs2-launcher',
            'karma-mocha-reporter'
        ],
        frameworks: ['mocha', 'chai-sinon'],
        reporters: ['mocha'],
        port: 9876,
        colors: false,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS2'],
        singleRun: true,
        autoWatchBatchDelay: 300,
        // you can define custom flags

        files: [
            { pattern: './node_modules/angular/angular.js', watched: false },
            { pattern: './node_modules/angular-mocks/angular-mocks.js', watched: false },
            { pattern: './test/**/*.spec*', watched: false }
        ],

        preprocessors: {
            './test/**/*.spec*': ['webpack']
        },

        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.js/,
                        exclude: [/app/, /node_modules/],
                        loader: 'babel',
                        query: {
                            presets: ['es2015']
                        }
                    }
                ]
            },
            resolve: {
                root: [
                    path.resolve('./')
                ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        },

        colors: true

    });
}