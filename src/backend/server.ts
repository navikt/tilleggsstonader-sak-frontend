import bodyParser from 'body-parser';
import express from 'express';
import RateLimit from 'express-rate-limit';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { setupLocal } from './auth/local';
import { getProfile } from './auth/profile';
import { getTokenFromHeader, attachToken, validateToken } from './auth/token';
import logger from './logger';
import { ApplicationName, miljø } from './miljø';
import { addRequestInfo, doProxy } from './proxy';
import { attachUnleashAuthToken } from './toggle';
import developmentConfig from './webpack/webpack.development';

const app = express();

const BASE_PATH = '';
const buildPath = path.resolve(process.cwd(), miljø.buildPath);
const PORT = 3000;

app.get(`${BASE_PATH}/internal/isAlive|isReady`, (req, res) => {
    res.sendStatus(200);
    return;
});

if (process.env.NODE_ENV === 'development') {
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

app.use(
    RateLimit({
        windowMs: 60 * 1000, // 60 seconds
        limit: 240, // limit to 120 requests per windowMs
        keyGenerator: (req) => getTokenFromHeader(req) || 'unauthorized',
    })
);

app.get(/^(?!.*\/(internal|static|api|oauth2|dokument)\/).*$/, validateToken(true), (_req, res) => {
    res.sendFile('index.html', { root: buildPath });
});

app.use('/api/env', addRequestInfo(), validateToken(), (req, res) => {
    res.status(200).send({
        roller: miljø.roller,
        unleashEnv: miljø.unleash.environment,
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
    '/api/klage',
    addRequestInfo(),
    attachToken(ApplicationName.klage),
    doProxy(ApplicationName.klage)
);

app.use(
    '/api/toggle',
    addRequestInfo(),
    validateToken(),
    attachUnleashAuthToken(),
    doProxy(ApplicationName.unleash)
);

app.use('/endringslogg', addRequestInfo(), doProxy(ApplicationName.endringslogg));

app.listen(PORT, () => {
    logger.info(`Server startet på PORT=${PORT}`);
}).on('error', (err: Error) => {
    logger.error(`server startup failed - ${err}`);
});
