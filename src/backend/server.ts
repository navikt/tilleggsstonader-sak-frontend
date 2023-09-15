import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import logger from './logger';
import { miljø } from './miljø';
import developmentConfig from './webpack/webpack.development';

const app = express();

const BASE_PATH = '';
const buildPath = path.resolve(process.cwd(), miljø.builldPath);
const PORT = 3000;

app.get(`${BASE_PATH}/internal/isAlive|isReady`, (req, res) => res.sendStatus(200));

if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const compiler = webpack(developmentConfig);

    const devMiddleware = webpackDevMiddleware(compiler, {
        writeToDisk: true,
        publicPath: developmentConfig.output.publicPath,
    });

    app.use(devMiddleware);
    app.use(webpackHotMiddleware(compiler));
} else {
    app.use(BASE_PATH, express.static(buildPath, { index: false }));
}

app.get(/^(?!.*\/(internal|static|api)\/).*$/, (_req, res) => {
    res.sendFile('index.html', { root: buildPath });
});

app.listen(PORT, () => {
    logger.info(`Server startet på PORT=${PORT}`);
});
