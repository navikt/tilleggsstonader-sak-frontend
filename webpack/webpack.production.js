import child from 'child_process';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

const publicPath = process.env.PUBLIC_PATH || '../../app/build';

const commitHash = child.execSync('git rev-parse --short HEAD').toString().trim();

const productionConfig = {
    mode: 'production',
    entry: './src/frontend/index.tsx',
    output: {
        filename: '[name].bundle.js',
        path: path.join(process.cwd(), 'dist_production'),
        publicPath: publicPath,
        clean: true,
    },
    devtool: 'source-map',
    module: {
        rules: [
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
            template: path.join(process.cwd(), 'src/frontend/index.html'),
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
