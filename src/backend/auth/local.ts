import cookieParser from 'cookie-parser';
import { Express, NextFunction, Request, Response } from 'express';
import session from 'express-session';
import * as oauth from 'oauth4webapi';
import * as client from 'openid-client';
import { TokenEndpointResponseHelpers } from 'openid-client';

import { getConfig } from './client';
import logger from '../logger';
import { redirectResponseToLogin } from './util';
import { miljø } from '../miljø';

type TokenSet = oauth.TokenEndpointResponse & TokenEndpointResponseHelpers;

export const setupLocal = async (app: Express) => {
    app.use(cookieParser());
    app.use(
        session({
            cookie: { sameSite: 'lax', secure: false },
            name: 'tilleggsstonad-local',
            resave: false,
            saveUninitialized: false,
            secret: 'DUMMY_SECRET',
        })
    );

    const config = await getConfig();

    app.get('/oauth2/login', async (req, res) => {
        const regex: RegExpExecArray | null = /redirect=(.*)/.exec(req.url);
        const redirectUrl = regex ? regex[1] : 'invalid';

        const redirectTo = client
            .buildAuthorizationUrl(config, {
                scope: `openid offline_access profile ${miljø.azure.client_id}/.default`,
            })
            .toString();

        // @ts-ignore
        req.session.redirectUrl = regex ? redirectUrl : '/';
        res.redirect(redirectTo);
    });

    app.get('/oauth2/callback', async (req, res) => {
        try {
            const codeGrant = await client.authorizationCodeGrant(
                config,
                new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`),
                {}
            );

            const accessToken = codeGrant.access_token;
            if (!accessToken) {
                res.status(500).send('Callback failed');
            } else {
                // @ts-ignore
                req.session.tokenSet = codeGrant;
                // @ts-ignore
                res.redirect(req.session.redirectUrl);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Authentication error:', error);
            res.status(500).send('Authentication failed');
        }
    });
    app.get('/oauth2/logout', (req, res) => {
        // @ts-ignore
        req.session.destroy(() => {
            res.status(200).send('Logget ut');
        });
    });

    // esnure authenticated
    app.use('/api/sak', (req, res, next) => {
        ensureAuthenticated(req, res, next);
    });
};

const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!req.session.tokenSet) {
        logger.error('ensureAuthenticated - Mangler sesjon med token');
        redirectResponseToLogin(req, res);
        return;
    }
    // @ts-ignore
    const tokenSet = req.session.tokenSet as TokenSet;
    if (erUtgått(tokenSet)) {
        logger.info('ensureAuthenticated - Token har utgått. Refresher token.');
        client
            .refreshTokenGrant(await getConfig(), tokenSet.refresh_token!)
            .then((newTokenSet) => {
                // @ts-ignore
                req.session.tokenSet = newTokenSet;
                logger.info('ensureAuthenticated - Refreshet token');
                next();
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log('ensureAuthenticated - Feilet refresh av token', e);
                redirectResponseToLogin(req, res);
            });
    } else {
        next();
    }
};

// kallkjedene kan ta litt tid, og tokenet kan i corner-case gå ut i løpet av kjeden. Så innfører et buffer
// på 2 minutter.
const erUtgått = (tokenSet: TokenSet): boolean => !tokenSet.expires_in || tokenSet.expires_in < 120;
