import { createRemoteJWKSet, jwtVerify, JWTVerifyResult } from 'jose';
import { JWTVerifyGetKey } from 'jose/dist/types/jwt/verify';
import { BaseClient, Client, errors, GrantBody, GrantExtras, Issuer } from 'openid-client';

import logger from '../logger';
import { miljø } from '../miljø';

import OPError = errors.OPError;

export interface ClientConfig {
    issuer: string;
    token_endpoint: string;
    client_id: string;
    client_secret?: string;
}

let cachedClientConfig: ClientConfig;

export const getClientConfig = (): ClientConfig => {
    if (!cachedClientConfig) {
        cachedClientConfig = {
            issuer: miljø.azure.issuer,
            token_endpoint: miljø.azure.token_endpoint,
            client_id: miljø.azure.client_id,
            client_secret: miljø.azure.client_secret,
        };
    }
    return cachedClientConfig;
};

const getIssuer = (): Issuer => {
    const { issuer, token_endpoint } = getClientConfig();
    return new Issuer({
        issuer,
        token_endpoint,
        token_endpoint_auth_signing_alg_values_supported: ['RS256'],
    });
};

const getGrantBody = (subject_token: string, audience: string): GrantBody => ({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: subject_token,
    scope: audience,
    requested_token_use: 'on_behalf_of',
});

const getAdditionalClaims = (): GrantExtras => {
    const { token_endpoint } = getClientConfig();
    const now = Math.floor(Date.now() / 1000);
    return {
        clientAssertionPayload: {
            nbf: now,
            aud: token_endpoint,
        },
    };
};

const createClient = (): Client => {
    const { client_id, client_secret } = getClientConfig();
    const issuer = getIssuer();
    return new issuer.Client({
        client_id,
        client_secret,
        token_endpoint_auth_method: 'client_secret_basic',
    });
};

const tokenExchange = async (
    client: Client,
    grantBody: GrantBody,
    additionalClaims: GrantExtras
): Promise<string | null> => {
    try {
        const tokenset = await client.grant(grantBody, additionalClaims);
        return tokenset.access_token ?? null;
    } catch (e) {
        if (e instanceof OPError) logger.warn(e.message, e.response?.body || '');
        throw e;
    }
};

export type OboProvider = (token: string, audience: string) => Promise<string | null>;

let cachedClient: BaseClient;
const client = () => {
    if (!cachedClient) {
        cachedClient = createClient();
    }
    return cachedClient;
};

let cachedRemoteJWKSet: JWTVerifyGetKey;
const remoteJWKSet = (): JWTVerifyGetKey => {
    if (!cachedRemoteJWKSet) {
        cachedRemoteJWKSet = createRemoteJWKSet(new URL(miljø.azure.openid_config_jwks_uri));
    }
    return cachedRemoteJWKSet;
};

export const azureOBO: OboProvider = (token: string, audience: string) =>
    tokenExchange(client(), getGrantBody(token, audience), getAdditionalClaims());

export const verify = async (token: string): Promise<JWTVerifyResult> =>
    await jwtVerify(token, remoteJWKSet(), {
        issuer: miljø.azure.issuer,
    });
