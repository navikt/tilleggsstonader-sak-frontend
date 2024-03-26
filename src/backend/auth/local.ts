/* eslint-disable */
import cookieParser from 'cookie-parser';
import { Express, NextFunction, Request, Response } from 'express';
import session from 'express-session';
import { BaseClient, custom, Issuer, TokenSet } from 'openid-client';
import { getClientConfig } from '../auth/client';
import logger from '../logger';
import { redirectResponseToLogin } from './util';

export const setupLocal = (app: Express) => {
    app.use(cookieParser());
    app.use(
        session({
            cookie: { sameSite: 'lax', secure: false },
            name: 'tilleggsstonad-local',
            resave: false,
            saveUninitialized: false,
            secret: '2E3V4I6R5NCAAOM4FHOYOI8JO34V2A6B',
        })
    );

    const clientConfig = getClientConfig();
    const oidcIssuerUrl = clientConfig.issuer;
    const loginClientConfig = {
        client_id: clientConfig.client_id,
        client_secret: clientConfig.client_secret,
        redirect_uri: 'http://localhost:3000/oauth2/callback',
    };

    custom.setHttpOptionsDefaults({
        timeout: 7500,
    });
    let client: BaseClient | undefined = undefined;

    Issuer.discover(oidcIssuerUrl).then((issuer) => {
        const issuerClient = new issuer.Client(loginClientConfig);
        client = issuerClient;
        app.get('/oauth2/login', (req, res) => {
            const authorizationUrl = issuerClient.authorizationUrl({
                scope: `openid offline_access profile ${loginClientConfig.client_id}/.default`,
            });
            const regex: RegExpExecArray | null = /redirect=(.*)/.exec(req.url);
            const redirectUrl = regex ? regex[1] : 'invalid';

            const successRedirect = regex ? redirectUrl : '/';
            // @ts-ignore
            req.session.redirectUrl = successRedirect;
            res.redirect(authorizationUrl);
        });

        app.get('/oauth2/callback', async (req, res) => {
            const params = issuerClient.callbackParams(req);

            try {
                const tokenSet = await issuerClient.callback(
                    loginClientConfig.redirect_uri,
                    params,
                    {
                        //nonce: 'your-nonce-value', // Generate and validate nonce to prevent CSRF
                    }
                );
                const accessToken = tokenSet.access_token;
                if (!accessToken) {
                    res.status(500).send('Callback failed');
                } else {
                    // @ts-ignore
                    req.session.tokenSet = tokenSet;
                    // @ts-ignore
                    res.redirect(req.session.redirectUrl);
                }
            } catch (error) {
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
    });

    // esnure authenticated
    app.use('/api/sak', (req, res, next) => {
        if (!client) {
            logger.error('Refresh av token. Har ikke initiert client');
            res.status(500).send('Har ikke initiert client');
            return;
        }
        ensureAuthenticated(client, req, res, next);
    });
};

const ensureAuthenticated = (
    client: BaseClient,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // @ts-ignore
    if (!req.session.tokenSet) {
        logger.error('ensureAuthenticated - Mangler sesjon med token');
        redirectResponseToLogin(req, res);
        return;
    }
    // @ts-ignore
    const tokenSet: TokenSet = new TokenSet(req.session.tokenSet);
    if (erUtgått(tokenSet)) {
        logger.info('ensureAuthenticated - Token har utgått. Refresher token.');
        client
            .refresh(tokenSet)
            .then((newTokenSet) => {
                // @ts-ignore
                req.session.tokenSet = newTokenSet;
                logger.info('ensureAuthenticated - Refreshet token');
                next();
            })
            .catch((e) => {
                console.log('ensureAuthenticated - Feilet refresh av token', e);
                redirectResponseToLogin(req, res);
            });
    } else {
        next();
    }
};

// kallkjedene kan ta litt tid, og tokenet kan i corner-case gå ut i løpet av kjeden. Så innfører et buffer
// på 2 minutter.
const erUtgått = (tokenSet: TokenSet): boolean =>
    tokenSet.expired() || (tokenSet.expires_in !== undefined && tokenSet.expires_in < 120);
