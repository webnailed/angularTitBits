var webpack = require('webpack'),
    path = require('path');


module.exports = {
    context: __dirname + '/app',
    entry: {
        app: './app.js',
        vendor: ['angular']
    },
    output: {
        path: __dirname + '/js',
        filename: 'app.bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],
    node: {
        fs: 'empty'
    },
    module: {
        loaders: [
            {
                test: /\.js/,
                exclude: [/test/, /node_modules/],
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};