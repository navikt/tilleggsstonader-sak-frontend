import { Express } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import developmentConfig from './webpack.development';

export function setupWebpackDevMiddleware(app: Express) {
    const webpackCompiler = webpack(developmentConfig as webpack.Configuration);

    if (!webpackCompiler) {
        throw new Error('Klarte ikke opprette webpack-kompilator');
    }

    const devMiddleware = webpackDevMiddleware(webpackCompiler, {
        writeToDisk: true,
        publicPath: developmentConfig.output.publicPath,
    });

    app.use(devMiddleware);
    app.use(webpackHotMiddleware(webpackCompiler));
}
