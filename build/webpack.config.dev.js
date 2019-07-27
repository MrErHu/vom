var path  = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',

    devtool: '#cheap-module-eval-source-map',

    entry: './demo/index.tsx',

    output: {
        path: path.resolve('../', 'dist'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /.tsx?$/,
                exclude: /node_modules/,
                use: ['awesome-typescript-loader']
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            tempalate: 'demo/template.html'
        })
    ]
};
