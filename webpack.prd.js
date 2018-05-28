const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    entry:'./src/assets/js/main.js',
    output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'docs/assets/js')
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {compress: {drop_console: true}},
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
}
