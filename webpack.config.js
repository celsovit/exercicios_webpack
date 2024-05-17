const modoDev = process.env.NODE_ENV !== 'production';

const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {

    mode: modoDev ? 'development' : 'production',   // uso de NODE_ENV
    // mode: 'development',
    // mode: 'production',

    entry: './src/principal.js',
    output: {
        path: __dirname + '/public',
        filename: 'principal.js',
    },
    devServer: {
        port: '9000',
        static: {
            directory: './public'
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'estilo.css',
        }),
    ],
    module: {
        rules: [
            {
                // test: /\.css$/i,                // REGEX casa CSS
                test: /\.s?[ac]ss$/i,              // REGEX casa CSS, SCSS e SASS
                use: [
                    // 'style-loader',             // Adiciona CSS a DOM injetando a tag <style>
                    MiniCssExtractPlugin.loader,
                    'css-loader',                  // interpreta @import, url()
                    'sass-loader',
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
              parallel: true,
            }),
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
};
