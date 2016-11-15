"use strict";

var webpack = require("webpack");
var config = require("./webpack.config");

config.plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compressor: { warnings: false }
    })
];

module.exports = config;
