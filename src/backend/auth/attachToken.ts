import { NextFunction, Request, RequestHandler, Response } from 'express';
import { decodeJwt } from 'jose';

import { azureOBO, verify } from './client';
import { withInMemoryCache } from './inMemoryCache';
import { secondsUntil } from './secondsUntil';
import { redirectResponseToLogin } from './util';
import { logWarn } from '../logger';
import { ApplicationName, miljø } from '../miljø';

const AUTHORIZATION_HEADER = 'authorization';
const WONDERWALL_ID_TOKEN_HEADER = 'x-wonderwall-id-token';

export const validateToken = (redirectToLogin: boolean = false): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await getValidatedTokenFromHeader(req);
            if (!token) {
                logWarn('Fant ikke gyldig token', req);
                if (redirectToLogin) {
                    return redirectResponseToLogin(req, res);
                } else {
                    return res.status(401).send('Fant ikke gyldig token');
                }
            }
            next();
        } catch (error) {
            logWarn(
                `Noe gikk galt ved validering av token (${req.method} - ${req.path}): `,
                req,
                error as Error
            );
            if (redirectToLogin) {
                return redirectResponseToLogin(req, res);
            } else {
                return res.status(401).send('En uventet feil oppstod. Ingen gyldig token');
            }
        }
    };
};

/**
 * Validerer token og utsteder OBO-token for [applicationName]
 */
export const attachToken = (applicationName: ApplicationName): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authenticationHeader = await prepareSecuredRequest(req, applicationName);
            if (!authenticationHeader) {
                logWarn('Fant ikke gyldig token', req);
                return res.status(401).send('Fant ikke gyldig token');
            }
            req.headers[AUTHORIZATION_HEADER] = authenticationHeader.authorization;
            delete req.headers[WONDERWALL_ID_TOKEN_HEADER];
            next();
        } catch (error) {
            logWarn(
                `Noe gikk galt ved utstedelse av obotoken (${req.method} - ${req.path}): `,
                req,
                error as Error
            );
            return res.status(401).send('En uventet feil oppstod. Ingen gyldig token');
        }
    };
};

export const getTokenFromHeader = (req: Request): string | null => {
    if (process.env.NODE_ENV === 'development') {
        // @ts-ignore lokalt lagres accessToken i sessionen for å kunne logge inn uten wonderwall
        return req.session.tokenSet?.access_token;
    }
    const { authorization } = req.headers;
    if (authorization == null) return null;
    if (!authorization.includes('Bearer ')) {
        return null;
    }
    return authorization.split(' ')[1];
};

const cachedAzureOBOProvoder = withInMemoryCache(azureOBO);

const getValidatedTokenFromHeader = async (req: Request) => {
    const token = getTokenFromHeader(req);
    if (token == null) {
        return null;
    }
    await verify(token);
    const payload = decodeJwt(token);
    if (secondsUntil(payload.exp ?? 0) <= 0) {
        logWarn(`Token har utgått exp=${payload.exp}`, req);
        return null;
    }
    return token;
};
const prepareSecuredRequest = async (req: Request, applicationName: ApplicationName) => {
    const token = await getValidatedTokenFromHeader(req);
    if (!token) return null;
    const { audience } = miljø.clients[applicationName];
    const accessToken = await cachedAzureOBOProvoder(token, `api://${audience}/.default`);
    return { authorization: `Bearer ${accessToken}` };
};
