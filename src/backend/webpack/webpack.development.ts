import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

import { miljø } from '../miljø';

const publicPath = process.env.PUBLIC_URL || '/';

const developmentConfig = {
    mode: 'development',
    entry: {
        tilleggsstønaderSakFrontend: [
            'webpack-hot-middleware/client?reload=true&overlay=false',
            '../../src/frontend/index.tsx',
        ],
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.join(process.cwd(), miljø.buildPath),
        publicPath: '/assets/',
        clean: true,
    },
    optimization: {
        runtimeChunk: 'single',
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                use: [`file-loader`],
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        noEmit: false,
                    },
                    onlyCompileBundledFiles: true,
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env'], ['@babel/preset-react']],
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Tilleggsstønader',
            template: path.join(process.cwd(), '../../src/frontend/index.html'),
            favicon: path.join(process.cwd(), '../../src/frontend/favicon.ico'),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.PUBLIC_URL': JSON.stringify(publicPath),
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};

export default developmentConfig;
