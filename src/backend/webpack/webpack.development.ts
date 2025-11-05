import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack, { Configuration } from 'webpack';

import { miljø } from '../miljø';

const publicPath = process.env.PUBLIC_URL || '/';

const developmentConfig = {
    mode: 'development' as const,
    entry: {
        sakFrontend: [
            'webpack-hot-middleware/client?reload=true&overlay=false',
            '../../src/frontend/index.tsx',
        ],
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].[contenthash].js',
        path: path.join(process.cwd(), miljø.buildPath),
        publicPath: '/assets/',
        clean: true,
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
        runtimeChunk: true,
        emitOnErrors: false,
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                use: [`file-loader`],
            },
            {
                // Match `.js`, `.jsx`, `.ts` or `.tsx` files
                test: /\.[jt]sx?$/,
                loader: 'esbuild-loader',
                options: {
                    target: 'ES2022',
                    tsconfig: '../../tsconfig.json',
                },
                exclude: /node_modules/,
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.module\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                                exportLocalsConvention: 'camelCaseOnly',
                                namedExport: false,
                            },
                            importLoaders: 1,
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                exclude: /\.module\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            async: true,
            typescript: {
                configFile: '../../tsconfig.json',
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true,
                },
            },
            formatter: {
                type: 'codeframe',
                pathType: 'absolute',
            },
        }),
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
} satisfies Configuration;

export default developmentConfig;
