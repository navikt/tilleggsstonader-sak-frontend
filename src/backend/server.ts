import bodyParser from 'body-parser';
import express from 'express';
import RateLimit from 'express-rate-limit';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { attachToken, getTokenFromHeader, validateToken } from './auth/attachToken';
import { setupLocal } from './auth/local';
import { getProfile } from './auth/profile';
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
    setupLocal(app);
} else {
    app.use('/assets', express.static(buildPath, { index: false }));
}

// Sett opp bodyParser og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset av bodyParser
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

app.get(/^(?!.*\/(internal|static|api|oauth2|dokument)\/).*$/, validateToken(true), (_req, res) => {
    res.sendFile('index.html', { root: buildPath });
});

app.use('/api/env', addRequestInfo(), validateToken(), (req, res) => {
    res.status(200).send({
        roller: miljø.roller,
    });
});
app.use('/api/profile', addRequestInfo(), validateToken(), getProfile());

app.use(
    '/api/sak',
    addRequestInfo(),
    attachToken(ApplicationName.sak),
    doProxy(ApplicationName.sak)
);

app.use(
    '/dokument',
    addRequestInfo(),
    attachToken(ApplicationName.sak),
    doProxy(ApplicationName.sak)
);

app.use(
    RateLimit({
        windowMs: 60 * 1000, // 60 seconds
        limit: 120, // limit each IP to 120 requests per windowMs
        keyGenerator: (req) => getTokenFromHeader(req) || 'unauthorized',
    })
);

app.listen(PORT, () => {
    logger.info(`Server startet på PORT=${PORT}`);
}).on('error', (err: Error) => {
    logger.error(`server startup failed - ${err}`);
});
