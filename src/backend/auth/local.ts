/* eslint-disable */
import cookieParser from 'cookie-parser';
import { Express } from 'express';
import session from 'express-session';
import { custom, Issuer } from 'openid-client';
import { getClientConfig } from '../auth/client';

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

    Issuer.discover(oidcIssuerUrl).then((issuer) => {
        const client = new issuer.Client(loginClientConfig);
        app.get('/oauth2/login', (req, res) => {
            const authorizationUrl = client.authorizationUrl({
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
            const params = client.callbackParams(req);

            try {
                const tokenSet = await client.callback(loginClientConfig.redirect_uri, params, {
                    //nonce: 'your-nonce-value', // Generate and validate nonce to prevent CSRF
                });
                const accessToken = tokenSet.access_token;
                if (!accessToken) {
                    res.status(500).send('Callback failed');
                } else {
                    // @ts-ignore
                    req.session.accessToken = accessToken;
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
};
