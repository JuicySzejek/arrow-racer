var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: './js/[name].js',
        path: path.resolve(__dirname, 'public'),
    },
    mode: 'development', // none, development, production

    devServer: {
        contentBase: path.join(__dirname, "public"),
        compress: true,
        port: 8080,
        historyApiFallback: {
            index: "index.html",
        },
    },

    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: './index.html',
            template: './index.html',
            title: "FPS - start",
            chunks: ['index'],
        }),
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],

            },

            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    }
                }]
            },

            {
                test: /\.(md2)$/i,
                type: 'asset/resource',
            }
        ]
    },
};