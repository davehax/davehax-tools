const webpack = require("webpack");
const merge = require('webpack-merge');
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: "source-map",
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            }
        ]
    }
});