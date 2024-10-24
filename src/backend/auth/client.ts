import { createRemoteJWKSet, jwtVerify, JWTVerifyResult } from 'jose';
import { JWTVerifyGetKey } from 'jose/dist/types/jwt/verify';
import * as client from 'openid-client';

import logger from '../logger';
import { miljø } from '../miljø';

let cachedConfig: client.Configuration;

export const getConfig = async (): Promise<client.Configuration> => {
    if (!cachedConfig) {
        cachedConfig = await client.discovery(
            new URL(miljø.azure.issuer),
            miljø.azure.client_id,
            miljø.azure.client_secret,
            undefined,
            { timeout: 5000 }
        );
    }
    return cachedConfig;
};

const tokenExchange = async (subject_token: string, audience: string): Promise<string> => {
    try {
        const response = await client.genericGrantRequest(
            await getConfig(),
            'urn:ietf:params:oauth:grant-type:jwt-bearer',
            { scope: audience, assertion: subject_token, requested_token_use: 'on_behalf_of' }
        );
        return response.access_token;
    } catch (e) {
        if (e instanceof Error) {
            logger.warn(`Feilet utstedelse av token: ${e.message}`);
        }
        return Promise.reject('Feilet utstedelse av token');
    }
};

export type OboProvider = (token: string, audience: string) => Promise<string | null>;

let cachedRemoteJWKSet: JWTVerifyGetKey;
const remoteJWKSet = (): JWTVerifyGetKey => {
    if (!cachedRemoteJWKSet) {
        cachedRemoteJWKSet = createRemoteJWKSet(new URL(miljø.azure.openid_config_jwks_uri));
    }
    return cachedRemoteJWKSet;
};

export const azureOBO: OboProvider = async (token: string, audience: string): Promise<string> =>
    await tokenExchange(token, audience);

export const verify = async (token: string): Promise<JWTVerifyResult> =>
    await jwtVerify(token, remoteJWKSet(), {
        issuer: miljø.azure.issuer,
    });
