var webpack = require('webpack');
var path = require("path");

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: "build/",
        filename: "bundle.js"
    },
    devServer: {
        contentBase : path.join(__dirname, 'src'),
        port : 3000
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: [/node_modules/, /public/],   
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader!autoprefixer-loader",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!autoprefixer-loader!less-loader",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.gif$/,
                loader: "url-loader?limit=10000&mimetype=image/gif"
            },
            {
                test: /\.jpg$/,
                loader: "url-loader?limit=10000&mimetype=image/jpg"
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=10000&mimetype=image/png"
            },
            {
                test: /\.svg/,
                loader: "url-loader?limit=26000&mimetype=image/svg+xml"
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.txt$/,
                use: 'raw-loader'
            }    
        ]
    }
}