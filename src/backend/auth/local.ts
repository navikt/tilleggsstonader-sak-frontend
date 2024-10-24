import cookieParser from 'cookie-parser';
import { Express, NextFunction, Request, Response } from 'express';
import session from 'express-session';
import * as oauth from 'oauth4webapi';
import * as client from 'openid-client';
import { Configuration, TokenEndpointResponseHelpers } from 'openid-client';

import { getConfig } from './client';
import logger from '../logger';
import { redirectResponseToLogin } from './util';
import { miljø } from '../miljø';

type TokenSet = oauth.TokenEndpointResponse & TokenEndpointResponseHelpers;

/**
 * Gjenbrukt fra https://github.com/panva/openid-client?tab=readme-ov-file#authorization-code-flow
 */
const generateParams = async (config: Configuration) => {
    /**
     * PKCE: The following MUST be generated for every redirect to the
     * authorization_endpoint. You must store the code_verifier and state in the
     * end-user session such that it can be recovered as the user gets redirected
     * from the authorization server back to your application.
     */
    const code_verifier: string = client.randomPKCECodeVerifier();
    const code_challenge: string = await client.calculatePKCECodeChallenge(code_verifier);

    const parameters: Record<string, string> = {
        redirect_uri: 'http://localhost:3000/oauth2/callback',
        scope: `openid offline_access profile ${miljø.azure.client_id}/.default`,
        code_challenge,
        code_challenge_method: 'S256',
    };

    if (!config.serverMetadata().supportsPKCE()) {
        /**
         * We cannot be sure the server supports PKCE so we're going to use state too.
         * Use of PKCE is backwards compatible even if the AS doesn't support it which
         * is why we're using it regardless. Like PKCE, random state must be generated
         * for every redirect to the authorization_endpoint.
         */
        parameters.state = client.randomState();
    }
    return { code_verifier, parameters };
};

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

        const { code_verifier, parameters } = await generateParams(config);

        const redirectTo = client.buildAuthorizationUrl(config, parameters).toString();

        // @ts-ignore
        req.session.redirectUrl = regex ? redirectUrl : '/';
        // @ts-ignore
        req.session.login_code_verifier = code_verifier;
        // @ts-ignore
        req.session.login_state = parameters.state;
        res.redirect(redirectTo);
    });

    app.get('/oauth2/callback', async (req, res) => {
        try {
            const codeGrant = await client.authorizationCodeGrant(
                config,
                new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`),
                {
                    // @ts-ignore
                    pkceCodeVerifier: req.session.login_code_verifier,
                    // @ts-ignore
                    expectedState: req.session.login_state,
                }
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
