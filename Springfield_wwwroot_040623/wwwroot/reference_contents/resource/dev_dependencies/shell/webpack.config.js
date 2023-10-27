const path = require('path');

module.exports = {
    entry: {
        shellAppVertical: './js/shellAppVertical.js',
        shellAppHorizontal: './js/shellAppHorizontal.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [[
                            "env", {
                                "targets": {
                                    "node": "current"
                                }
                            }
                        ]]
                    }
                }
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    },
    devtool: 'source-map'
};