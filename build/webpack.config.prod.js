var path  = require('path');

module.exports = {
    mode: 'production',

    entry: './index.ts',

    output: {
        path: path.resolve('./', 'dist'),
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
    }
};
