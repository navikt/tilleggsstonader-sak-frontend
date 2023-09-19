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
        if (process.env.NODE_ENV === 'development') {
            cachedClientConfig = {
                issuer: 'https://login.microsoftonline.com/navq.onmicrosoft.com/v2.0',
                token_endpoint:
                    'https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/v2.0/token',
                client_id: process.env.AZURE_APP_CLIENT_ID as string,
                client_secret: process.env.AZURE_APP_CLIENT_SECRET as string,
            };
        } else {
            cachedClientConfig = {
                issuer: process.env.AZURE_OPENID_CONFIG_ISSUER as string,
                token_endpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT as string,
                client_id: process.env.AZURE_APP_CLIENT_ID as string,
                client_secret: process.env.AZURE_APP_CLIENT_SECRET as string,
            };
        }
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
        const uri = process.env.AZURE_OPENID_CONFIG_JWKS_URI ?? miljø.AZURE_OPENID_CONFIG_JWKS_URI;
        cachedRemoteJWKSet = createRemoteJWKSet(new URL(uri as string));
    }
    return cachedRemoteJWKSet;
};

export const azureOBO: OboProvider = (token: string, audience: string) =>
    tokenExchange(client(), getGrantBody(token, audience), getAdditionalClaims());

export const verify = async (token: string): Promise<JWTVerifyResult> => {
    return await jwtVerify(token, remoteJWKSet(), {
        issuer: process.env.AZURE_OPENID_CONFIG_ISSUER,
    });
};
