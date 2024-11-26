import child from 'child_process';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

const publicPath = process.env.PUBLIC_PATH || '/';

const commitHash = child.execSync('git rev-parse --short HEAD').toString().trim();

const productionConfig = {
    mode: 'production',
    entry: './src/frontend/index.tsx',
    output: {
        filename: '[name].bundle.js',
        path: path.join(process.cwd(), 'dist_production'),
        publicPath: '/assets/',
        clean: true,
    },
    devtool: 'source-map',
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
                    tsconfig: './tsconfig.json',
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
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },
    plugins: [
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
