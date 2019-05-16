'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(path.resolve(__dirname), './src/index.js'),
    output: {
        path: path.resolve(__dirname, '.'),
        filename: 'index.js',
        libraryTarget: 'umd2'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            plugins: ['transform-decorators-legacy' ],
                            presets: ['es2015', 'stage-0']
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [],
};