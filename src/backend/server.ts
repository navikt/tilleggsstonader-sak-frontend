import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { attachToken } from './auth/attachToken';
import { setupLocal } from './auth/local';
import logger from './logger';
import { ApplicationName, miljø } from './miljø';
import { addRequestInfo, doProxy } from './proxy';
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
    dotenv.config();
    setupLocal(app);
} else {
    app.use(BASE_PATH, express.static(buildPath, { index: false }));
}

// Sett opp bodyParser og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset av bodyParser
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

app.get(/^(?!.*\/(internal|static|api|oauth2)\/).*$/, (_req, res) => {
    res.sendFile('index.html', { root: buildPath });
});

app.use(
    '/api/sak',
    addRequestInfo(),
    attachToken(ApplicationName.sak),
    doProxy('/api/sak', ApplicationName.sak)
);

app.listen(PORT, () => {
    logger.info(`Server startet på PORT=${PORT}`);
}).on('error', (err: Error) => {
    logger.error(`server startup failed - ${err}`);
});
