import { NextFunction, Request, RequestHandler, Response } from 'express';

import { azureOBO } from './client';
import { withInMemoryCache } from './inMemoryCache';
import { logInfo, logWarn } from '../logger';

const AUTHORIZATION_HEADER = 'authorization';
const WONDERWALL_ID_TOKEN_HEADER = 'x-wonderwall-id-token';
export type ApplicationName = 'tilleggsstonader-sak';

export const attachToken = (applicationName: ApplicationName): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authenticationHeader = await prepareSecuredRequest(req, applicationName);
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

const erLokalt = () => {
    return process.env.ENV === 'localhost';
};

const harBearerToken = (authorization: string) => {
    return authorization.includes('Bearer ');
};

const utledToken = (req: Request, authorization: string | undefined) => {
    if (erLokalt()) {
        throw Error('Håndterer ikke localhost ennå');
    } else if (authorization && harBearerToken(authorization)) {
        return authorization.split(' ')[1];
    } else {
        throw Error('Mangler authorization i header');
    }
};

const cachedAzureOBOProvoder = withInMemoryCache(azureOBO);
const prepareSecuredRequest = async (req: Request, applicationName: ApplicationName) => {
    logInfo('PrepareSecuredRequest', req);
    const { authorization } = req.headers;
    const token = utledToken(req, authorization);
    logInfo('Token found: ' + (token.length > 1), req);
    const audience = `api://${process.env.NAIS_CLUSTER_NAME}.tilleggsstonader.${applicationName}/.default`;
    const accessToken = await cachedAzureOBOProvoder(token, audience);
    return {
        authorization: `Bearer ${accessToken}`,
    };
};
