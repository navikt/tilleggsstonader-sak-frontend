import bodyParser from 'body-parser';
import express from 'express';
import RateLimit from 'express-rate-limit';
import path from 'path';

import { setupLocalAuth } from './auth/local';
import { getProfile } from './auth/profile';
import { attachToken, getTokenFromHeader, validateToken } from './auth/token';
import { autocompleteHandler } from './autocomplete';
import { embeddedMapHandler } from './embeddedMap';
import { kartverketTilesHandler } from './kartverket-tiles';
import logger from './logger';
import { ApplicationName, miljø } from './miljø';
import { addRequestInfo, doProxy } from './proxy';
import { tilesHandler } from './tiles';
import { attachUnleashAuthToken } from './toggle';
import { setupWebpackDevMiddleware } from './webpack/webpack-dev-middleware';

const app = express();

const BASE_PATH = '';
const buildPath = path.resolve(process.cwd(), miljø.buildPath);
const PORT = 3000;

app.get([`${BASE_PATH}/internal/isAlive`, `${BASE_PATH}/internal/isReady`], (req, res) => {
    res.sendStatus(200);
    return;
});

if (process.env.NODE_ENV === 'development') {
    setupWebpackDevMiddleware(app);
    setupLocalAuth(app);
} else {
    app.use('/assets', express.static(buildPath, { index: false }));
}

// Sett opp bodyParser og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset av bodyParser
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

app.use(
    RateLimit({
        windowMs: 5 * 1000, // 5 seconds
        limit: 1000, // limit to 1000 requests per windowMs
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

app.get('/api/kart/embedded-map', addRequestInfo(), validateToken(true), embeddedMapHandler);
app.post('/api/kart/autocomplete', addRequestInfo(), validateToken(true), autocompleteHandler);
app.get(
    '/api/kartverket-tiles/:z/:x/:y',
    addRequestInfo(),
    validateToken(true),
    kartverketTilesHandler
);
app.get(
    '/api/kart/google-maps-tiles/:z/:x/:y',
    addRequestInfo(),
    validateToken(true),
    tilesHandler
);

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

app.use('/api/generer-lenke-modia', addRequestInfo(), doProxy(ApplicationName.modiacontext));

app.listen(PORT, () => {
    logger.info(`Server startet på PORT=${PORT}`);
}).on('error', (err: Error) => {
    logger.error(`server startup failed - ${err}`);
});
