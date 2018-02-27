/**
 * Created by yaojia7 on 2017/5/31.
 */
const webpack = require('webpack');
const vendors = [
    'react',
    'react-dom',
    'react-router',
    'redux',
    'react-redux',
    'react-router-redux',
    'redux-devtools',
    'redux-logger',
    'redux-saga',
    'reselect',
    'moment',
    'antd',
    'd3'
];

module.exports = {
    output: {
        path: __dirname + '/res/js',
        filename: '[name].js',
        library: '[name]'
    },
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
    },
    entry: {
        "lib": vendors
    },
    plugins: (process.env.NODE_ENV == 'production') ? [
        new webpack.DllPlugin({
            path: __dirname + '/res/js/manifest.json',
            name: '[name]',
            context: __dirname
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
    ] : [
        new webpack.DllPlugin({
            path: __dirname + '/res/js/manifest.json',
            name: '[name]',
            context: __dirname
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ]
};
