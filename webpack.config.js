const webpack = require('webpack');
const path = require('path');
module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
        publicPath: "/assets/"
    },
    module: {
        loaders: [{
            test: /\.jsx?|.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    devServer: {
        contentBase: "./dist",
        inline: true
    }
};