import child from 'child_process';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

const publicPath = process.env.PUBLIC_PATH || '/';

const commitHash = child.execSync('git rev-parse --short HEAD').toString().trim();

const productionConfig = {
    mode: 'production',
    entry: './src/frontend/index.tsx',
    output: {
        filename: '[name].[contenthash].js',
        path: path.join(process.cwd(), 'dist_production'),
        publicPath: '/assets/',
        clean: true,
    },
    devtool: 'source-map',
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
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name].[contenthash][ext]',
                },
            },
            {
                // Match `.js`, `.jsx`, `.ts` or `.tsx` files
                test: /\.[jt]sx?$/,
                loader: 'esbuild-loader',
                options: {
                    target: 'ES2022',
                    tsconfig: './tsconfig.json',
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
            async: false,
            typescript: {
                configFile: './tsconfig.json',
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true,
                },
            },
        }),
        new HtmlWebpackPlugin({
            title: 'Tilleggsstønader',
            template: path.join(process.cwd(), 'src/frontend/index.html'),
            favicon: path.join(process.cwd(), '/src/frontend/favicon.ico'),
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.DefinePlugin({
            'process.env.PUBLIC_URL': JSON.stringify(publicPath),
            'process.env.COMMIT_HASH': JSON.stringify(commitHash),
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};

export default productionConfig;
