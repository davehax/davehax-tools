const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OfflinePlugin = require('offline-plugin');

module.exports = {
    entry: {
        app: "./src/index.js"
    },
    plugins: [
        new CleanWebpackPlugin(["dist", "../sw-webpack-poketype.js"], {
            allowExternal: true
        }),
        new HtmlWebpackPlugin({
            template: "src/index.template.ejs",
            inject: "body"
        }),
        new OfflinePlugin({
            ServiceWorker: {
                output: "../../sw-webpack-poketype.js",
                minify: false
            }
        }),
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [
                    "file-loader"
                ]
            }, 
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    "file-loader"
                ]
            }
        ]
    }
}