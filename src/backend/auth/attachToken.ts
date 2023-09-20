import { NextFunction, Request, RequestHandler, Response } from 'express';
import { decodeJwt } from 'jose';

import { azureOBO, verify } from './client';
import { withInMemoryCache } from './inMemoryCache';
import { getTokenFromHeader, secondsUntil } from './secondsUntil';
import { logWarn } from '../logger';

const AUTHORIZATION_HEADER = 'authorization';
const WONDERWALL_ID_TOKEN_HEADER = 'x-wonderwall-id-token';
export type ApplicationName = 'tilleggsstonader-sak';

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
                `Noe gikk galt ved setting av token (${req.method} - ${req.path}): `,
                req,
                error as Error
            );
            return res.status(401).send('En uventet feil oppstod. Ingen gyldig token');
        }
    };
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
    const audience = `api://${process.env.NAIS_CLUSTER_NAME}.tilleggsstonader.${applicationName}/.default`;
    const accessToken = await cachedAzureOBOProvoder(token, audience);
    return { authorization: `Bearer ${accessToken}` };
};
