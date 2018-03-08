const path = require('path');
const webpack = require('webpack');
const config = require('./config');
if(!process.env.NODE_ENV){
    process.env.NODE_ENV = 'development';
}

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
    devtool: 'inline-source-map',
    entry: (NODE_ENV == 'development')?[
        'eventsource-polyfill',
        `webpack-hot-middleware/client?path=http://127.0.0.1:${config.port}/__webpack_hmr&timeout=20000`,
        __dirname + '/src/index.jsx'
    ]:[
        __dirname + '/src/index.jsx'
    ],
    output: {
        path: __dirname + '/res/js',
        filename: 'bundle.js',
        publicPath: `http://127.0.0.1:${config.port}/js/`
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: (NODE_ENV == 'development')?[
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(__dirname + '/res/js/manifest.json')
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ]:[
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(__dirname + '/res/js/manifest.json')
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(css|scss)$/,
                loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!sass-loader"
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    }
};
